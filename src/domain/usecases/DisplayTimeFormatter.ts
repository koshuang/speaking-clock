/**
 * Domain use case for formatting time and date for display
 * Provides consistent formatting across the UI
 */
export class DisplayTimeFormatter {
  /**
   * Format time for display (HH:MM:SS)
   *
   * @param date - Date to format
   * @returns Formatted time string
   */
  formatTime(date: Date): string {
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
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
   *
   * @param date - Date to format
   * @returns Formatted time string without seconds
   */
  formatTimeShort(date: Date): string {
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
}
