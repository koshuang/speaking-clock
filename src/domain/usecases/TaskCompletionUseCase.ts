import type { Todo, TodoList } from '../entities/Todo'

/**
 * Task Completion Use Case - 任務完成業務邏輯
 *
 * 處理任務完成時的各種判斷邏輯，遵循 Clean Architecture 原則
 * 將業務規則從 Presentation 層移至 Domain 層
 */
export class TaskCompletionUseCase {
  /**
   * 判斷任務是否準時完成
   *
   * @param isTimedTask - 是否為計時任務
   * @param remainingSeconds - 剩餘秒數（僅計時任務使用）
   * @returns 是否準時完成
   */
  isCompletedOnTime(isTimedTask: boolean, remainingSeconds: number): boolean {
    // 計時任務：剩餘時間 > 0 才算準時
    // 非計時任務：永遠算準時
    return isTimedTask ? remainingSeconds > 0 : true
  }

  /**
   * 檢查是否完成所有任務
   *
   * @param todoList - 待辦清單
   * @param completingTodoId - 正在完成的任務 ID
   * @returns 是否完成所有任務
   */
  willCompleteAllTasks(todoList: TodoList, completingTodoId: string): boolean {
    const todos = todoList.items
    if (todos.length === 0) return false

    // 計算完成後的已完成數量（排除正在完成的任務避免重複計算）
    const currentlyCompleted = todos.filter(
      t => t.completed && t.id !== completingTodoId
    ).length
    const willBeCompleted = currentlyCompleted + 1
    return willBeCompleted === todos.length
  }

  /**
   * 判斷任務是否為計時任務且正在進行中
   *
   * @param todo - 待辦事項
   * @param activeTodoId - 當前進行中的任務 ID
   * @returns 是否為進行中的計時任務
   */
  isActiveTimedTask(todo: Todo, activeTodoId: string | null): boolean {
    return todo.id === activeTodoId && !!todo.durationMinutes
  }

  /**
   * 檢查任務是否可以被完成
   *
   * @param todo - 待辦事項
   * @returns 是否可以完成（未完成的任務才能被完成）
   */
  canComplete(todo: Todo | undefined): boolean {
    return !!todo && !todo.completed
  }

  /**
   * 檢查任務是否可以被取消完成
   *
   * @param todo - 待辦事項
   * @returns 是否可以取消完成（已完成的任務才能取消）
   */
  canUncomplete(todo: Todo | undefined): boolean {
    return !!todo && todo.completed
  }
}
