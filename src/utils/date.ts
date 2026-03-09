/**
 * Format a Date object to a string in the format 'YYYY-MM-DD HH:mm:ss'
 * @param date - The date to format (defaults to current date/time)
 * @returns Formatted date string
 */
export function formatDateTime(date: Date = new Date()): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Format a timestamp to a string in the format 'YYYY-MM-DD HH:mm:ss'
 * @param timestamp - The timestamp to format
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: number): string {
  return formatDateTime(new Date(timestamp));
}
