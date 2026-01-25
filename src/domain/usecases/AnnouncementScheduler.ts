/**
 * Domain use case for calculating announcement schedule
 * Determines when the next announcement should occur based on settings
 */
export class AnnouncementScheduler {
  /**
   * Calculate the next announcement time based on current time and interval
   * Announcements occur when minutes % interval === 0
   *
   * @param currentTime - Current date/time
   * @param intervalMinutes - Interval between announcements (e.g., 5, 10, 15, 30, 60)
   * @returns Date object representing the next announcement time
   */
  getNextAnnouncementTime(currentTime: Date, intervalMinutes: number): Date {
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()

    // Find next minute that is divisible by interval
    // Announcements trigger within first 2 seconds of the minute
    const isAtInterval = minutes % intervalMinutes === 0
    const isPastTrigger = seconds >= 2

    let nextMinute: number
    if (isAtInterval && !isPastTrigger) {
      // Will trigger soon (within 2 seconds)
      nextMinute = minutes
    } else {
      // Find next interval minute
      nextMinute = (Math.floor(minutes / intervalMinutes) + 1) * intervalMinutes
    }

    const next = new Date(currentTime)
    if (nextMinute >= 60) {
      next.setHours(next.getHours() + 1)
      next.setMinutes(nextMinute - 60)
    } else {
      next.setMinutes(nextMinute)
    }
    next.setSeconds(0)
    next.setMilliseconds(0)

    return next
  }

  /**
   * Check if an announcement should be triggered at the given time
   *
   * @param time - Time to check
   * @param intervalMinutes - Interval between announcements
   * @returns true if announcement should trigger
   */
  shouldAnnounce(time: Date, intervalMinutes: number): boolean {
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()

    // Trigger within first 2 seconds of an interval minute
    return minutes % intervalMinutes === 0 && seconds < 2
  }

  /**
   * Format the next announcement time as a string (HH:MM)
   *
   * @param nextTime - Next announcement time
   * @returns Formatted time string
   */
  formatNextTime(nextTime: Date): string {
    return nextTime.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
}
