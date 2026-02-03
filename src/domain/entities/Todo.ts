export interface Todo {
  id: string
  text: string
  icon?: string
  completed: boolean
  order: number
  createdAt: number
  durationMinutes?: number
  goalId?: string  // Links this todo to an UltimateGoal
}

export interface TodoList {
  items: Todo[]
}

export interface ActiveTaskState {
  todoId: string
  status: 'active' | 'paused'
  startedAt: number
  accumulatedTime: number
  lastAnnouncedCheckpoint?: string
}

export const DEFAULT_TODO_LIST: TodoList = {
  items: [],
}
