import React from 'react'
import { Progress as ProgressRoot } from '@base-ui/react/progress'
import {
  ProgressIndicator,
  ProgressTrack,
} from '@/shared/ui/primitives/progress'

interface StatusCount {
  statusId: string
  name: string
  color: string
  icon?: string | null
  issueCount: number
}

interface IssueStatusBreakdownProps {
  statuses: Array<StatusCount>
  totalIssues: number
}

export const IssueStatusBreakdown: React.FC<IssueStatusBreakdownProps> = ({
  statuses,
}) => {
  const maxCount = Math.max(...statuses.map((s) => s.issueCount), 1)

  return (
    <div className="h-full bg-layer-1 border border-subtle rounded-xl p-5 flex flex-col">
      <h3 className="text-14 font-bold text-primary mb-4">Issues by Status</h3>

      {statuses.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-11 text-secondary">No statuses configured</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {statuses.map((status) => {
            const percentage = (status.issueCount / maxCount) * 100

            return (
              <div key={status.statusId} className="py-3 first:pt-0 last:pb-0">
                {/* Label + count */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-14 text-secondary">{status.name}</span>
                  <span className="text-14 font-semibold text-primary tabular-nums">
                    {status.issueCount}
                  </span>
                </div>
                <ProgressRoot.Root value={percentage} className="w-full">
                  <ProgressTrack className="h-[5px] bg-layer-transparent">
                    <ProgressIndicator
                      className="transition-all duration-700 rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: status.color,
                      }}
                    />
                  </ProgressTrack>
                </ProgressRoot.Root>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
