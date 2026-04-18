import React from 'react'

interface ProjectHealthProps {
  openIssues: number
  completedIssues: number
  overdueIssues: number
  pageCount: number
  memberCount: number
}

interface StatChipProps {
  label: string
  value: number | string
  valueClass?: string
}

const StatChip: React.FC<StatChipProps> = ({ label, value, valueClass }) => (
  <div className="flex-1 min-w-[100px] sm:min-w-[120px] bg-layer-1 border border-subtle rounded-xl px-4 py-3 sm:px-5 sm:py-4">
    <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary mb-1.5 truncate">
      {label}
    </p>
    <p className={`text-2xl font-bold tabular-nums leading-none truncate ${valueClass ?? ''}`}>
      {value}
    </p>
  </div>
)

export const ProjectHealth: React.FC<ProjectHealthProps> = ({
  openIssues,
  completedIssues,
  overdueIssues,
  pageCount,
  memberCount,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <StatChip label="Open Issues" value={openIssues} />
      <StatChip label="Completed" value={completedIssues} valueClass="text-primary" />
      <StatChip
        label="Overdue"
        value={overdueIssues}
        valueClass={overdueIssues > 0 ? 'text-red-500' : ''}
      />
      <StatChip label="Pages" value={pageCount} />
      <StatChip label="Members" value={memberCount} />
    </div>
  )
}
