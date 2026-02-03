import type { Todo, ActiveTaskState } from '../entities/Todo'
import { TaskReminderTextGenerator } from './TaskReminderTextGenerator'

export interface PostAnnouncementContext {
  activeTodo: Todo | null
  activeTaskState: ActiveTaskState | null
  remainingSeconds: number
  nextUncompletedTodo: Todo | null
  childName?: string
  // Goal-related fields
  activeGoal?: { name: string; targetTime: string } | null
  goalTimeUntilDeadline?: number // minutes until goal deadline
}

export interface PostAnnouncementResult {
  type: 'active_task' | 'next_todo' | 'goal' | 'none'
  message: string | null
  todo: Todo | null
}

/**
 * Domain use case for determining what to announce after time announcement
 * Decides between active task reminder, next todo, or nothing
 */
export class PostAnnouncementUseCase {
  private readonly textGenerator: TaskReminderTextGenerator

  constructor(textGenerator: TaskReminderTextGenerator) {
    this.textGenerator = textGenerator
  }

  /**
   * Determine what should be announced after time is spoken
   *
   * @param context - Current context with active task and todo information
   * @returns Result indicating what to announce
   */
  getNextAnnouncement(context: PostAnnouncementContext): PostAnnouncementResult {
    const {
      activeTodo,
      activeTaskState,
      remainingSeconds,
      nextUncompletedTodo,
      childName,
      activeGoal,
      goalTimeUntilDeadline,
    } = context
    const namePrefix = childName ? `${childName}，` : ''

    let baseMessage = ''
    let resultType: 'active_task' | 'next_todo' | 'goal' | 'none' = 'none'
    let resultTodo: Todo | null = null

    // Priority 1: Active task that is running (not paused)
    if (
      activeTodo &&
      activeTodo.durationMinutes &&
      activeTaskState &&
      activeTaskState.status === 'active' &&
      remainingSeconds > 0
    ) {
      const remainingMinutes = Math.ceil(remainingSeconds / 60)
      baseMessage = this.textGenerator.generateProgressText(activeTodo.text, remainingMinutes)
      resultType = 'active_task'
      resultTodo = activeTodo
    }
    // Priority 2: Next uncompleted todo
    else if (nextUncompletedTodo) {
      baseMessage = this.generateNextTodoMessage(nextUncompletedTodo)
      resultType = 'next_todo'
      resultTodo = nextUncompletedTodo
    }

    // Add goal reminder if applicable
    const goalReminder =
      activeGoal && goalTimeUntilDeadline !== undefined
        ? this.generateGoalReminderText(activeGoal.name, goalTimeUntilDeadline)
        : null

    // Construct final message
    let finalMessage = ''
    if (baseMessage && goalReminder) {
      finalMessage = `${namePrefix}${baseMessage}。${goalReminder}`
    } else if (baseMessage) {
      finalMessage = `${namePrefix}${baseMessage}`
    } else if (goalReminder) {
      finalMessage = `${namePrefix}${goalReminder}`
      resultType = 'goal'
    }

    // If there's a goal reminder but no other message, return goal type
    if (!baseMessage && goalReminder) {
      return {
        type: 'goal',
        message: finalMessage,
        todo: null,
      }
    }

    // If no message at all
    if (!finalMessage) {
      return {
        type: 'none',
        message: null,
        todo: null,
      }
    }

    return {
      type: resultType,
      message: finalMessage,
      todo: resultTodo,
    }
  }

  /**
   * Generate message for next todo announcement
   */
  private generateNextTodoMessage(todo: Todo): string {
    if (todo.durationMinutes) {
      return `接下來是${todo.text}，共 ${todo.durationMinutes} 分鐘`
    }
    return `接下來是${todo.text}`
  }

  /**
   * Generate goal reminder text based on time until deadline
   *
   * @param goalName - Name of the goal
   * @param minutesLeft - Minutes until deadline (negative if overdue)
   * @returns Reminder text or null if no reminder needed
   */
  private generateGoalReminderText(goalName: string, minutesLeft: number): string | null {
    // No reminder if more than 30 minutes away
    if (minutesLeft > 30) {
      return null
    }

    // Overdue
    if (minutesLeft < 0) {
      const minutesOverdue = Math.abs(minutesLeft)
      return `已經超過${goalName}時間${minutesOverdue}分鐘`
    }

    // Less than 5 minutes
    if (minutesLeft < 5) {
      return `距離${goalName}只剩${minutesLeft}分鐘了`
    }

    // 5-15 minutes
    if (minutesLeft < 15) {
      return `距離${goalName}還有${minutesLeft}分鐘，請加快準備`
    }

    // 15-30 minutes
    return `距離${goalName}還有${minutesLeft}分鐘`
  }

  /**
   * Check if there's something to announce
   */
  hasAnnouncement(context: PostAnnouncementContext): boolean {
    return this.getNextAnnouncement(context).type !== 'none'
  }
}
