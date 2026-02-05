/**
 * Use case for handling task deadline calculations and reminders
 */
export class TaskDeadlineUseCase {
  // Threshold in minutes - if deadline appears more than this behind, assume it's tomorrow
  private static readonly NEXT_DAY_THRESHOLD_MINUTES = 6 * 60 // 6 hours

  /**
   * Parse HH:MM time string to Date object, handling midnight crossover
   *
   * If the deadline time appears to be significantly in the past (more than 6 hours ago),
   * assume the deadline is for tomorrow, not today.
   *
   * Example: Current time 23:51, deadline 00:58 -> deadline is tomorrow at 00:58
   */
  private parseDeadlineToDate(deadline: string, now: Date): Date {
    const [hours, minutes] = deadline.split(':').map(Number)
    const deadlineDate = new Date(now)
    deadlineDate.setHours(hours, minutes, 0, 0)

    // Check if deadline appears to be significantly in the past
    const diffMs = deadlineDate.getTime() - now.getTime()
    const diffMinutes = diffMs / (1000 * 60)

    // If deadline is more than 6 hours "behind", assume it's for tomorrow
    if (diffMinutes < -TaskDeadlineUseCase.NEXT_DAY_THRESHOLD_MINUTES) {
      deadlineDate.setDate(deadlineDate.getDate() + 1)
    }

    return deadlineDate
  }

  /**
   * Calculate minutes until deadline (negative if overdue)
   *
   * @param deadline - Deadline in HH:MM format
   * @param now - Current time (defaults to new Date())
   * @returns Minutes until deadline (negative if past, up to 6 hours overdue)
   */
  getMinutesUntilDeadline(deadline: string, now: Date = new Date()): number {
    const deadlineDate = this.parseDeadlineToDate(deadline, now)
    const diffMs = deadlineDate.getTime() - now.getTime()
    return Math.round(diffMs / (1000 * 60))
  }

  /**
   * Check if task is overdue
   *
   * @param deadline - Deadline in HH:MM format
   * @param now - Current time (defaults to new Date())
   * @returns True if deadline has passed
   */
  isOverdue(deadline: string, now: Date = new Date()): boolean {
    return this.getMinutesUntilDeadline(deadline, now) < 0
  }

  /**
   * Generate deadline reminder text in Chinese
   *
   * @param taskName - Name of the task
   * @param deadline - Deadline in HH:MM format
   * @param now - Current time (defaults to new Date())
   * @returns Reminder text string
   */
  generateDeadlineReminder(
    taskName: string,
    deadline: string,
    now: Date = new Date()
  ): string {
    const minutesUntil = this.getMinutesUntilDeadline(deadline, now)

    if (minutesUntil < 0) {
      // Overdue
      const minutesOverdue = Math.abs(minutesUntil)
      return `${taskName}已經超過${minutesOverdue}分鐘了`
    }

    if (minutesUntil === 0) {
      return `${taskName}時間到了`
    }

    // Still time remaining
    return `還有${minutesUntil}分鐘要完成${taskName}`
  }

  /**
   * Check if deadline is approaching (within threshold minutes)
   *
   * @param deadline - Deadline in HH:MM format
   * @param thresholdMinutes - Minutes before deadline to consider "approaching"
   * @param now - Current time (defaults to new Date())
   * @returns True if within threshold or overdue
   */
  isDeadlineApproaching(
    deadline: string,
    thresholdMinutes: number = 15,
    now: Date = new Date()
  ): boolean {
    const minutesUntil = this.getMinutesUntilDeadline(deadline, now)
    return minutesUntil <= thresholdMinutes
  }
}
