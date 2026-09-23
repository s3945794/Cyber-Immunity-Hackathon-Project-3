import Link from 'next/link'
import type { IncidentSummary } from '@/types/incident'
import { cn } from '@/lib/utils'
import { severityBadgeClass, statusBadgeClass } from './constants'

interface IncidentTableProps {
  incidents: IncidentSummary[]
}

/** Renders the incident list as linked rows. Each row links to `/incidents/[id]`. */
export function IncidentTable({ incidents }: IncidentTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500 uppercase dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Incident ID
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Threat
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Severity
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Indicators
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {incidents.map((incident) => (
            <tr key={incident.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/incidents/${incident.id}`}
                  className="text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
                >
                  {incident.id}
                </Link>
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{incident.threat}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                    severityBadgeClass(incident.severity)
                  )}
                >
                  {incident.severity}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                    statusBadgeClass(incident.status)
                  )}
                >
                  {incident.status}
                </span>
              </td>
              <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                {incident.indicators.length > 0 ? incident.indicators.join(', ') : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
