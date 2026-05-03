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
    <div className={cn('rounded-lg border border-subtle overflow-hidden bg-layer-1', className)}>
      <table className="w-full text-13">
        <thead>
          <tr className="bg-layer-2 border-b border-subtle">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-11 font-semibold uppercase tracking-wide text-tertiary',
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
                className="group border-b border-subtle last:border-0 hover:bg-layer-transparent-hover transition-colors duration-100"
                style={{
                  animationDelay: `${index * 30}ms`,
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-13 text-primary',
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
