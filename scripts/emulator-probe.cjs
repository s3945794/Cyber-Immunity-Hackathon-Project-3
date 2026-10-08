'use strict'
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { randomUUID } = require('node:crypto')
const project = process.env.GCLOUD_PROJECT || ''
const phase = process.argv[2]
const markerPath = path.resolve(__dirname, '..', '.emulator-tests', project, 'marker.json')
// Validate isolation before importing the Admin SDK or opening any database.
if (
  !/^demo-soc-tests-[0-9]+-[a-f0-9]{8}$/.test(project) ||
  process.env.SOC_LOCAL_DEMO !== 'true' ||
  process.env.SOC_DEMO_SHORT_DURATION !== 'false' ||
  process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8086' ||
  process.env.SOC_TEST_MARKER !== markerPath ||
  !['seed', 'reload'].includes(phase)
) {
  console.error('Isolated test emulator and marker required.')
  process.exit(1)
}
const { AccessService } = require('../backend/lib/access/service.js')
const { FirestoreStore } = require('../backend/lib/access/store.js')
const { adminDb } = require('../backend/lib/lib/firebase.js')
const { actorRef } = require('../backend/lib/access/types.js')
const service = new AccessService(new FirestoreStore())
// Synthetic verified-identity inputs test storage/service behaviour, not JWT verification.
const roles = ['soc-analyst', 'soc-supervisor', 'soc-team-leader', 'soc-manager']
const users = roles.map((role, index) => ({
  uid: 'isolated-soc-' + index,
  email: undefined,
  claims: { iss: 'https://unit.example/realms/isolated', sub: 'isolated-soc-' + index },
  roles: [role],
}))
const [a, b, c, d] = users
const recognisedActors = new Set(users.map(actorRef))
const reason = 'Isolated emulator transaction and persistence verification.'
const rejectionReason = 'Synthetic rejection reason retained across emulator restart.'
const body = (incidentId, resource) => ({
  incidentId,
  resource,
  permission: 'read',
  reason,
  durationSeconds: 900,
  acknowledged: true,
})
const approve = (user, id, op = randomUUID()) =>
  service.decide(user, id, { decision: 'approve' }, op)
async function denied(work, status) {
  await assert.rejects(work, (error) => error.status === status)
}
function outcomesMatch(outcomes, successes, status) {
  assert.equal(outcomes.filter((result) => result.status === 'fulfilled').length, successes)
  for (const result of outcomes) {
    if (result.status === 'rejected') assert.equal(result.reason.status, status)
  }
}
const collections = [
  'accessRequests',
  'requestScopes',
  'requestOperations',
  'approvalRecords',
  'auditEvents',
  'authorityJobs',
]
async function snapshot() {
  const records = {}
  for (const collection of collections) {
    const rows = await adminDb.collection(collection).get()
    records[collection] = rows.docs
      .map((doc) => ({ id: doc.id, data: doc.data() }))
      .sort((left, right) => left.id.localeCompare(right.id))
  }
  const history = []
  for (const user of users) {
    history.push({ mine: await service.list(user, false), review: await service.list(user, true) })
  }
  const audit = await service.audit(a)
  assert.equal(audit.nextCursor, null)
  assert.equal(audit.events.length, records.auditEvents.length)
  assert.equal(history.flatMap((item) => item.mine.requests).length, records.accessRequests.length)
  for (const { data: request } of records.accessRequests) {
    assert.equal(
      new Set(request.approvals.map((approval) => approval.actorRef)).size,
      request.approvals.length
    )
    assert.ok(recognisedActors.has(request.requesterRef))
    assert.ok(
      request.approvals.every(
        (approval) =>
          recognisedActors.has(approval.actorRef) && approval.actorRef !== request.requesterRef
      )
    )
    assert.ok(request.approvals.length <= 2)
    const decisions = records.approvalRecords.filter((row) => row.data.requestId === request.id)
    assert.equal(
      decisions.filter((row) => row.data.decision === 'approve').length,
      request.approvals.length
    )
    const events = audit.events.filter((event) => event.requestId === request.id)
    assert.equal(events.filter((event) => event.type === 'request.created').length, 1)
    assert.equal(
      events.filter((event) => event.type === 'request.approved').length,
      request.approvals.length
    )
    assert.equal(
      events.filter((event) => event.type === 'request.rejected').length,
      request.status === 'rejected' ? 1 : 0
    )
    assert.equal(
      events.filter((event) => event.type === 'request.cancelled').length,
      request.status === 'cancelled' ? 1 : 0
    )
    assert.equal(
      events.filter((event) => event.type === 'authority.failed').length,
      request.status === 'authorising' ? 1 : 0
    )
    const view = await service.detail(a, request.id)
    assert.equal(view.evidenceAvailable, false)
    assert.equal(view.accessStartedAt, null)
    assert.equal(view.expiresAt, null)
  }
  return { records, history, audit }
}
async function seed() {
  for (const collection of collections) {
    assert.equal((await adminDb.collection(collection).limit(1).get()).empty, true)
  }
  const pendingBody = body('INC-1001', 'victimHost')
  const createOps = Array.from({ length: 4 }, () => randomUUID())
  const creates = await Promise.allSettled(
    createOps.map((op) => service.create(a, pendingBody, op))
  )
  outcomesMatch(creates, 1, 409)
  const winnerIndex = creates.findIndex((result) => result.status === 'fulfilled')
  const pending = creates[winnerIndex].value
  assert.equal(pending.status, 'pending')
  await denied(() => service.create(a, pendingBody, randomUUID()), 409)
  await denied(() => approve(a, pending.id), 403)
  await denied(
    () =>
      service.decide(a, pending.id, { decision: 'reject', reason: rejectionReason }, randomUUID()),
    403
  )

  const single = await service.create(a, body('INC-1001', 'exposureEvidence'), randomUUID())
  const approveOps = Array.from({ length: 4 }, () => randomUUID())
  const duplicates = await Promise.allSettled(approveOps.map((op) => approve(b, single.id, op)))
  outcomesMatch(duplicates, 1, 409)
  const approvalOp = approveOps[duplicates.findIndex((result) => result.status === 'fulfilled')]
  assert.equal((await service.detail(a, single.id)).approvalCount, 1)
  assert.equal((await service.detail(a, single.id)).status, 'pending')

  const quorum = await service.create(a, body('INC-1001', 'suspiciousProcess'), randomUUID())
  const approvals = await Promise.allSettled([b, c, d].map((user) => approve(user, quorum.id)))
  outcomesMatch(approvals, 2, 409)
  assert.equal((await service.detail(a, quorum.id)).status, 'authorising')
  assert.equal((await service.detail(a, quorum.id)).approvalCount, 2)

  const rejected = await service.create(a, body('INC-1002', 'victimHost'), randomUUID())
  await approve(b, rejected.id)
  const rejectOp = randomUUID()
  const rejectBody = { decision: 'reject', reason: rejectionReason }
  await service.decide(c, rejected.id, rejectBody, rejectOp)
  assert.equal((await service.detail(a, rejected.id)).rejectionReason, rejectionReason)
  await denied(() => approve(d, rejected.id), 409)

  const cancelledBody = body('INC-1002', 'exposureEvidence')
  const cancelled = await service.create(a, cancelledBody, randomUUID())
  const cancelOp = randomUUID()
  await service.cancel(a, cancelled.id, {}, cancelOp)
  const replacement = await service.create(a, cancelledBody, randomUUID())
  assert.notEqual(replacement.id, cancelled.id)
  assert.equal((await service.detail(a, cancelled.id)).status, 'cancelled')
  assert.equal(
    (await service.incidentRequests(a, 'INC-1002')).requests.find(
      (row) => row.resource === 'exposureEvidence'
    ).id,
    replacement.id
  )

  const selfRace = await service.create(a, body('INC-1003', 'victimHost'), randomUUID())
  const selfOutcomes = await Promise.allSettled([approve(a, selfRace.id), approve(d, selfRace.id)])
  assert.equal(selfOutcomes[0].status, 'rejected')
  assert.equal(selfOutcomes[0].reason.status, 403)
  assert.equal(selfOutcomes[1].status, 'fulfilled')
  assert.equal((await service.detail(a, selfRace.id)).approvalCount, 1)

  const cancelRace = await service.create(a, body('INC-1003', 'exposureEvidence'), randomUUID())
  const cancelOutcomes = await Promise.allSettled([
    service.cancel(a, cancelRace.id, {}, randomUUID()),
    approve(b, cancelRace.id),
  ])
  assert.equal(cancelOutcomes[0].status, 'fulfilled')
  if (cancelOutcomes[1].status === 'rejected') assert.equal(cancelOutcomes[1].reason.status, 409)
  assert.equal((await service.detail(a, cancelRace.id)).status, 'cancelled')

  // All recognised roles can request; each has an independent requester scope.
  const equalRoles = await Promise.all(
    users.map((user) => service.create(user, body('INC-1004', 'victimHost'), randomUUID()))
  )
  assert.equal(new Set(equalRoles.map((request) => request.id)).size, 4)
  for (let index = 0; index < users.length; index++) {
    await approve(users[(index + 1) % users.length], equalRoles[index].id)
    await denied(() => approve(users[index], equalRoles[index].id), 403)
  }
  const expected = await snapshot()
  assert.equal(expected.records.accessRequests.length, 12)
  const rejectedRecord = expected.records.approvalRecords.find(
    (row) => row.data.requestId === rejected.id && row.data.decision === 'reject'
  )
  assert.equal(rejectedRecord.data.reason, rejectionReason)
  assert.equal(
    expected.audit.events.find(
      (event) => event.requestId === rejected.id && event.type === 'request.rejected'
    ).reason,
    rejectionReason
  )
  assert.ok(expected.history[0].mine.requests.some((request) => request.id === cancelled.id))
  assert.ok(expected.history[0].mine.requests.some((request) => request.id === replacement.id))
  assert.ok(expected.records.authorityJobs.every((row) => row.data.status === 'blocked'))
  assert.equal(expected.records.authorityJobs.length, 1)
  fs.writeFileSync(
    markerPath,
    JSON.stringify({
      project,
      expected,
      pending: { id: pending.id, body: pendingBody, op: createOps[winnerIndex] },
      single: { id: single.id, op: approvalOp },
      rejected: { id: rejected.id, body: rejectBody, op: rejectOp },
      cancelled: { id: cancelled.id, op: cancelOp },
      replacementId: replacement.id,
    }),
    { flag: 'wx' }
  )
  console.info(
    'PASS seed: pending requests, decisions/reasons, cancellation/history, audit and concurrent guards; evidence stays locked.'
  )
}
async function reload() {
  const marker = JSON.parse(fs.readFileSync(markerPath, 'utf8'))
  assert.equal(marker.project, project)
  assert.deepEqual(await snapshot(), marker.expected)
  const pendingDuplicates = await Promise.allSettled(
    Array.from({ length: 4 }, () => service.create(a, marker.pending.body, randomUUID()))
  )
  outcomesMatch(pendingDuplicates, 0, 409)
  const approvalDuplicates = await Promise.allSettled(
    Array.from({ length: 4 }, () => approve(b, marker.single.id))
  )
  outcomesMatch(approvalDuplicates, 0, 409)
  const selfApprovals = await Promise.allSettled(
    Array.from({ length: 4 }, () => approve(a, marker.pending.id))
  )
  outcomesMatch(selfApprovals, 0, 403)
  await denied(
    () =>
      service.decide(
        a,
        marker.pending.id,
        { decision: 'reject', reason: rejectionReason },
        randomUUID()
      ),
    403
  )
  assert.equal(
    (await service.create(a, marker.pending.body, marker.pending.op)).id,
    marker.pending.id
  )
  assert.equal((await approve(b, marker.single.id, marker.single.op)).approvalCount, 1)
  assert.equal(
    (await service.decide(c, marker.rejected.id, marker.rejected.body, marker.rejected.op))
      .rejectionReason,
    rejectionReason
  )
  assert.equal(
    (await service.cancel(a, marker.cancelled.id, {}, marker.cancelled.op)).status,
    'cancelled'
  )
  // Rejected retries and idempotent replays must not append decisions or audit events.
  assert.deepEqual(await snapshot(), marker.expected)
  console.info(
    'PASS reload: exact Firestore records and API history/audit survive export/import; duplicate/self-approval guards and idempotency still hold.'
  )
}
async function main() {
  await (phase === 'seed' ? seed() : reload())
}
main()
  .then(() => adminDb.terminate())
  .catch(async (error) => {
    console.error(
      'Isolated Firestore ' +
        phase +
        ' probe failed' +
        (error.code === 'ERR_ASSERTION' ? ' an assertion.' : '.')
    )
    process.exitCode = 1
    await adminDb.terminate()
  })
