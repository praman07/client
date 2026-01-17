import { format } from 'date-fns'

export const formatDate = (
  dateString: string | Date,
  formatStr = 'MMM d, yyyy',
) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Unknown date'
    return format(date, formatStr)
  } catch (e) {
    return 'Unknown date'
  }
}
