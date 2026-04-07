import { DataTableEmpty } from './data-table-empty'
import { cn } from '@/shared/lib/utils'

export interface ColumnDef<TRow> {
  key: string
  header: string
  headerClassName?: string
  cellClassName?: string
  render: (row: TRow, index: number) => React.ReactNode
}

interface DataTableProps<TRow> {
  columns: Array<ColumnDef<TRow>>
  rows: Array<TRow>
  rowKey: (row: TRow) => string
  search?: string
  emptyMessage?: string
  emptySearchMessage?: string
  className?: string
}

export function DataTable<TRow>({
  columns,
  rows,
  rowKey,
  search,
  emptyMessage = 'No results found.',
  emptySearchMessage,
  className,
}: DataTableProps<TRow>) {
  const effectiveEmptyMessage =
    search && rows.length === 0 && emptySearchMessage
      ? emptySearchMessage
      : emptyMessage

  return (
    <div className={cn('rounded-xl border border-border/40 overflow-hidden bg-card/20 shadow-sm', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/30 border-b border-border/40">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80',
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <DataTableEmpty
              colSpan={columns.length}
              message={effectiveEmptyMessage}
            />
          ) : (
            rows.map((row, index) => (
              <tr
                key={rowKey(row)}
                className="group border-b border-border/20 transition-colors hover:bg-muted/10 last:border-0"
                style={{
                  animationDelay: `${index * 30}ms`,
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-sm text-foreground/90',
                      col.cellClassName,
                    )}
                  >
                    {col.render(row, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
