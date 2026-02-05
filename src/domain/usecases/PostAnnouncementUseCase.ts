import type { Todo, ActiveTaskState } from '../entities/Todo'
import { TaskReminderTextGenerator } from './TaskReminderTextGenerator'

export interface DeadlineTodoInfo {
  todo: Todo
  minutesUntil: number // negative if overdue
}

export interface PostAnnouncementContext {
  activeTodo: Todo | null
  activeTaskState: ActiveTaskState | null
  remainingSeconds: number
  nextUncompletedTodo: Todo | null
  childName?: string
  // Goal-related fields
  activeGoal?: { name: string; targetTime: string } | null
  goalTimeUntilDeadline?: number // minutes until goal deadline
  // Deadline-related fields
  deadlineTodos?: DeadlineTodoInfo[] // todos with deadlines, sorted by urgency
}

export interface PostAnnouncementResult {
  type: 'active_task' | 'next_todo' | 'deadline' | 'goal' | 'none'
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
      deadlineTodos,
    } = context
    const namePrefix = childName ? `${childName}，` : ''

    let baseMessage = ''
    let resultType: 'active_task' | 'next_todo' | 'deadline' | 'goal' | 'none' = 'none'
    let resultTodo: Todo | null = null

    // Priority 1: Active timed task that is running (not paused) with time remaining
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
    // Priority 2: Active timed task that has timed out (time <= 0) - remind to complete
    else if (
      activeTodo &&
      activeTodo.durationMinutes &&
      activeTaskState &&
      remainingSeconds <= 0
    ) {
      baseMessage = `${activeTodo.text}時間已到，請完成任務`
      resultType = 'active_task'
      resultTodo = activeTodo
    }
    // Priority 3: Active non-timed task - report elapsed time
    else if (
      activeTodo &&
      !activeTodo.durationMinutes &&
      activeTaskState &&
      activeTaskState.status === 'active'
    ) {
      const elapsedMinutes = Math.floor(remainingSeconds / 60)
      baseMessage = `${activeTodo.text}已進行${elapsedMinutes}分鐘`
      resultType = 'active_task'
      resultTodo = activeTodo
    }
    // Priority 4: Deadline approaching or overdue (within 15 minutes or past due)
    else if (deadlineTodos && deadlineTodos.length > 0) {
      // Find the most urgent deadline todo (already sorted by urgency)
      const urgentDeadline = deadlineTodos.find(
        (d) => d.minutesUntil <= 15 && !d.todo.completed && d.todo.id !== activeTodo?.id
      )
      if (urgentDeadline) {
        baseMessage = this.generateDeadlineReminderText(
          urgentDeadline.todo.text,
          urgentDeadline.minutesUntil
        )
        resultType = 'deadline'
        resultTodo = urgentDeadline.todo
      }
    }

    // Priority 5: Next uncompleted todo (but not the active task)
    if (!baseMessage && nextUncompletedTodo && nextUncompletedTodo.id !== activeTodo?.id) {
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
   * Generate deadline reminder text based on time until deadline
   *
   * @param taskName - Name of the task
   * @param minutesUntil - Minutes until deadline (negative if overdue)
   * @returns Reminder text
   */
  private generateDeadlineReminderText(taskName: string, minutesUntil: number): string {
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
   * Generate goal reminder text based on time until deadline
   *
   * @param goalName - Name of the goal
   * @param minutesLeft - Minutes until deadline (negative if overdue)
   * @returns Reminder text (always returns a message when there's an active goal)
   */
  private generateGoalReminderText(goalName: string, minutesLeft: number): string {
    // Overdue
    if (minutesLeft < 0) {
      const minutesOverdue = Math.abs(minutesLeft)
      return `已經超過${goalName}時間${minutesOverdue}分鐘`
    }

    // Less than 5 minutes - urgent
    if (minutesLeft < 5) {
      return `距離${goalName}只剩${minutesLeft}分鐘了`
    }

    // 5-15 minutes - moderate urgency
    if (minutesLeft < 15) {
      return `距離${goalName}還有${minutesLeft}分鐘，請加快準備`
    }

    // 15-30 minutes
    if (minutesLeft < 30) {
      return `距離${goalName}還有${minutesLeft}分鐘`
    }

    // > 30 minutes - just informational
    return `距離${goalName}還有${minutesLeft}分鐘`
  }

  /**
   * Check if there's something to announce
   */
  hasAnnouncement(context: PostAnnouncementContext): boolean {
    return this.getNextAnnouncement(context).type !== 'none'
  }
}
