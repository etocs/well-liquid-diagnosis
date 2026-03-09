/**
 * Format a Date object to a string in the format 'YYYY-MM-DD HH:mm:ss'
 * Uses local timezone
 * @param date - The date to format (defaults to current date/time)
 * @returns Formatted date string
 */
export function formatDateTime(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Format a timestamp to a string in the format 'YYYY-MM-DD HH:mm:ss'
 * @param timestamp - The timestamp to format
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: number): string {
  return formatDateTime(new Date(timestamp));
}
