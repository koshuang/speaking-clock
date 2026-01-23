import type { TodoList } from '../entities/Todo'

export interface TodoRepository {
  load(): TodoList
  save(todoList: TodoList): void
}
