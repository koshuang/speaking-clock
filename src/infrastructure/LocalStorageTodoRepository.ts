import type { TodoList } from '../domain/entities/Todo'
import { DEFAULT_TODO_LIST } from '../domain/entities/Todo'
import type { TodoRepository } from '../domain/ports/TodoRepository'

const STORAGE_KEY = 'speaking-clock-todos'

export class LocalStorageTodoRepository implements TodoRepository {
  load(): TodoList {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_TODO_LIST, ...JSON.parse(saved) }
      }
    } catch {
      console.error('無法讀取待辦清單')
    }
    return DEFAULT_TODO_LIST
  }

  save(todoList: TodoList): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList))
    } catch {
      console.error('無法儲存待辦清單')
    }
  }
}
