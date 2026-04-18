import { InboxIcon } from 'lucide-react'

interface DataTableEmptyProps {
  colSpan: number
  message?: string
}

export function DataTableEmpty({
  colSpan,
  message = 'No results found.',
}: DataTableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="py-16 text-center"
      >
        <div className="flex flex-col items-center gap-3 text-tertiary">
          <InboxIcon className="h-8 w-8 opacity-25" />
          <p className="text-13 italic">{message}</p>
        </div>
      </td>
    </tr>
  )
}
