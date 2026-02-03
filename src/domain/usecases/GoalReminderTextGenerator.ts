export class GoalReminderTextGenerator {
  /**
   * Generate warning text when approaching deadline
   * @param goalName - Name of the goal (e.g., "出門")
   * @param minutesLeft - Minutes remaining until deadline
   * @returns Warning text in Chinese
   */
  generateDeadlineWarning(goalName: string, minutesLeft: number): string {
    if (minutesLeft <= 5) {
      return `距離${goalName}還有${minutesLeft}分鐘，請加快腳步`
    } else if (minutesLeft <= 15) {
      return `距離${goalName}還有${minutesLeft}分鐘`
    } else {
      return `距離${goalName}還有${minutesLeft}分鐘，請開始準備`
    }
  }

  /**
   * Generate suggestion text for when to start preparing
   * @param goalName - Name of the goal
   * @param startTime - Recommended start time
   * @param totalMinutes - Total minutes needed for all tasks
   * @returns Suggestion text in Chinese
   */
  generateStartSuggestion(goalName: string, startTime: Date, totalMinutes: number): string {
    const hours = startTime.getHours().toString().padStart(2, '0')
    const minutes = startTime.getMinutes().toString().padStart(2, '0')
    return `為了${goalName}，建議${hours}:${minutes}開始準備，共需${totalMinutes}分鐘`
  }

  /**
   * Generate warning when past deadline
   * @param goalName - Name of the goal
   * @param minutesOverdue - Minutes past the deadline
   * @returns Overdue warning text in Chinese
   */
  generateOverdueWarning(goalName: string, minutesOverdue: number): string {
    return `已經超過${goalName}時間${minutesOverdue}分鐘了`
  }

  /**
   * Generate progress update text
   * @param completedCount - Number of completed tasks
   * @param totalCount - Total number of tasks
   * @returns Progress text in Chinese
   */
  generateProgressUpdate(completedCount: number, totalCount: number): string {
    return `目前進度：${completedCount}/${totalCount}項完成`
  }
}
