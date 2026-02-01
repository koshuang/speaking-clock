/**
 * Domain use case for formatting time and date for display
 * Provides consistent formatting across the UI
 */
export class DisplayTimeFormatter {
  /**
   * Format time for display (HH:MM:SS)
   * Uses manual formatting for consistent behavior across all environments
   *
   * @param date - Date to format
   * @returns Formatted time string
   */
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  /**
   * Format date for display (YYYY年M月D日 星期X)
   *
   * @param date - Date to format
   * @returns Formatted date string
   */
  formatDate(date: Date): string {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  /**
   * Format time without seconds (HH:MM)
   * Uses manual formatting for consistent behavior across all environments
   *
   * @param date - Date to format
   * @returns Formatted time string without seconds
   */
  formatTimeShort(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }
}
