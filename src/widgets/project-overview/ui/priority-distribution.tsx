import React from 'react'
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts'
import type {ChartConfig} from '@/shared/ui/primitives/chart';
import {
  
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/shared/ui/primitives/chart'

interface PriorityCount {
  priority: string
  count: number
}

interface PriorityDistributionProps {
  distribution: Array<PriorityCount>
}

const PRIORITY_CONFIG: Record<
  string,
  { label: string; shortLabel: string; color: string }
> = {
  URGENT:      { label: 'Urgent', shortLabel: 'Urgent', color: '#ef4444' },
  HIGH:        { label: 'High',   shortLabel: 'High',   color: '#f59e0b' },
  MEDIUM:      { label: 'Medium', shortLabel: 'Medium', color: '#6366f1' },
  LOW:         { label: 'Low',    shortLabel: 'Low',    color: '#22c55e' },
  NO_PRIORITY: { label: 'None',   shortLabel: 'None',   color: '#6b7280' },
}

const ORDER = ['URGENT', 'HIGH', 'MEDIUM', 'LOW', 'NO_PRIORITY']

export const PriorityDistribution: React.FC<PriorityDistributionProps> = ({
  distribution,
}) => {
  const sorted = [...distribution].sort(
    (a, b) => ORDER.indexOf(a.priority) - ORDER.indexOf(b.priority),
  )

  const hasData = sorted.some((d) => d.count > 0)

  const chartData = sorted.map((d) => {
    const cfg = PRIORITY_CONFIG[d.priority] ?? {
      label: d.priority,
      shortLabel: d.priority,
      color: '#9ca3af',
    }
    return {
      priority: d.priority,
      label: cfg.shortLabel,
      count: d.count,
      color: cfg.color,
    }
  })

  // Build ChartConfig for the tooltip to read labels from
  const chartConfig: ChartConfig = {
    count: { label: 'Issues' },
    ...Object.fromEntries(
      sorted.map((d) => {
        const cfg = PRIORITY_CONFIG[d.priority] ?? {
          label: d.priority,
          color: '#9ca3af',
        }
        return [d.priority, { label: cfg.label, color: cfg.color }]
      }),
    ),
  }

  return (
    <div className="h-full bg-card border border-border rounded-xl p-5 flex flex-col">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Issues by Priority
      </h3>

      {!hasData ? (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
          <p className="text-[11px] text-muted-foreground">No open issues</p>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="flex-1 w-full aspect-auto min-h-[160px]">
          <BarChart
            data={chartData}
            barCategoryGap="30%"
            margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'currentColor' }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: 'currentColor' }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
              width={28}
            />
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="priority"
                  indicator="dot"
                />
              }
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {chartData.map((entry) => (
                <Cell key={entry.priority} fill={entry.color} fillOpacity={entry.count === 0 ? 0.2 : 0.85} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}
