import { AccessRequestView } from '@/features/access-requests/components/AccessRequestView'

interface RequestAccessPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ resource?: string | string[] }>
}

export default async function RequestAccessPage({ params, searchParams }: RequestAccessPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const resourceQuery =
    typeof query.resource === 'string' ? query.resource : query.resource === undefined ? null : ''

  return <AccessRequestView incidentId={id} resourceQuery={resourceQuery} />
}
