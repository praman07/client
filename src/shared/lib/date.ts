import { format, formatDistanceToNowStrict } from 'date-fns'

export const formatDate = (
  dateString: string | Date,
  formatStr = 'MMM d, yyyy',
) => {
  try {
    const isNumericString = typeof dateString === 'string' && dateString.trim() !== '' && !isNaN(Number(dateString))
    const date = new Date(isNumericString ? Number(dateString) : dateString)
    if (isNaN(date.getTime())) return 'Unknown date'
    return format(date, formatStr)
  } catch (e) {
    return 'Unknown date'
  }
}

export const formatDateRelative = (dateString: string | Date) => {
  try {
    const isNumericString = typeof dateString === 'string' && dateString.trim() !== '' && !isNaN(Number(dateString))
    const date = new Date(isNumericString ? Number(dateString) : dateString)
    if (isNaN(date.getTime())) return 'Unknown date'
    const distanceToNow = formatDistanceToNowStrict(date, { addSuffix: false })

    // formatDistanceToNowStrict gives strings like '2 hours', '1 day', '3 months'.
    // We can map it to shorter representations like '2h ago', '1d ago' to match the design.
    // Or just append ' ago' if we keep it simple '2 hours ago'. 
    // The design shows '2h ago'. Let's do a quick regex replace for short versions.
    const shortDistance = distanceToNow
      .replace(/ seconds?/, 's')
      .replace(/ minutes?/, 'm')
      .replace(/ hours?/, 'h')
      .replace(/ days?/, 'd')
      .replace(/ months?/, 'mo')
      .replace(/ years?/, 'y')

    return `${shortDistance} ago`
  } catch (e) {
    return 'Unknown date'
  }
}
