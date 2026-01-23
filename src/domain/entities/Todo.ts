export interface Todo {
  id: string
  text: string
  icon?: string
  completed: boolean
  order: number
  createdAt: number
}

export interface TodoList {
  items: Todo[]
}

export const DEFAULT_TODO_LIST: TodoList = {
  items: [],
}
