import type { Todo, ActiveTaskState } from '../entities/Todo'
import { TaskReminderTextGenerator } from './TaskReminderTextGenerator'

export interface PostAnnouncementContext {
  activeTodo: Todo | null
  activeTaskState: ActiveTaskState | null
  remainingSeconds: number
  nextUncompletedTodo: Todo | null
  childName?: string
}

export interface PostAnnouncementResult {
  type: 'active_task' | 'next_todo' | 'none'
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
    const { activeTodo, activeTaskState, remainingSeconds, nextUncompletedTodo, childName } = context
    const namePrefix = childName ? `${childName}，` : ''

    // Priority 1: Active task that is running (not paused)
    if (
      activeTodo &&
      activeTodo.durationMinutes &&
      activeTaskState &&
      activeTaskState.status === 'active' &&
      remainingSeconds > 0
    ) {
      const remainingMinutes = Math.ceil(remainingSeconds / 60)
      const baseMessage = this.textGenerator.generateProgressText(
        activeTodo.text,
        remainingMinutes
      )
      return {
        type: 'active_task',
        message: `${namePrefix}${baseMessage}`,
        todo: activeTodo,
      }
    }

    // Priority 2: Next uncompleted todo
    if (nextUncompletedTodo) {
      // Use the speak reminder format for next todo
      const baseMessage = this.generateNextTodoMessage(nextUncompletedTodo)
      return {
        type: 'next_todo',
        message: `${namePrefix}${baseMessage}`,
        todo: nextUncompletedTodo,
      }
    }

    // Nothing to announce
    return {
      type: 'none',
      message: null,
      todo: null,
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
   * Check if there's something to announce
   */
  hasAnnouncement(context: PostAnnouncementContext): boolean {
    return this.getNextAnnouncement(context).type !== 'none'
  }
}
