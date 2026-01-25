import type { Todo, TodoList } from '../entities/Todo'
import type { TodoRepository } from '../ports/TodoRepository'

export class ManageTodosUseCase {
  private readonly todoRepository: TodoRepository

  constructor(todoRepository: TodoRepository) {
    this.todoRepository = todoRepository
  }

  load(): TodoList {
    return this.todoRepository.load()
  }

  add(todoList: TodoList, text: string, icon?: string, durationMinutes?: number): TodoList {
    const maxOrder = todoList.items.reduce(
      (max, item) => Math.max(max, item.order),
      -1
    )

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      icon,
      completed: false,
      order: maxOrder + 1,
      createdAt: Date.now(),
      durationMinutes,
    }

    const updatedList: TodoList = {
      items: [...todoList.items, newTodo],
    }

    this.todoRepository.save(updatedList)
    return updatedList
  }

  update(todoList: TodoList, id: string, text: string, icon?: string, durationMinutes?: number): TodoList {
    const updatedList: TodoList = {
      items: todoList.items.map((item) =>
        item.id === id ? { ...item, text: text.trim(), icon, durationMinutes } : item
      ),
    }

    this.todoRepository.save(updatedList)
    return updatedList
  }

  remove(todoList: TodoList, id: string): TodoList {
    const updatedList: TodoList = {
      items: todoList.items.filter((item) => item.id !== id),
    }

    this.todoRepository.save(updatedList)
    return updatedList
  }

  toggle(todoList: TodoList, id: string): TodoList {
    const updatedList: TodoList = {
      items: todoList.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }

    this.todoRepository.save(updatedList)
    return updatedList
  }

  reorder(todoList: TodoList, fromIndex: number, toIndex: number): TodoList {
    const sortedItems = [...todoList.items].sort((a, b) => a.order - b.order)
    const [movedItem] = sortedItems.splice(fromIndex, 1)
    sortedItems.splice(toIndex, 0, movedItem)

    const updatedItems = sortedItems.map((item, index) => ({
      ...item,
      order: index,
    }))

    const updatedList: TodoList = {
      items: updatedItems,
    }

    this.todoRepository.save(updatedList)
    return updatedList
  }

  getNextUncompleted(todoList: TodoList): Todo | null {
    const sortedItems = [...todoList.items].sort((a, b) => a.order - b.order)
    return sortedItems.find((item) => !item.completed) || null
  }

  getSortedItems(todoList: TodoList): Todo[] {
    return [...todoList.items].sort((a, b) => a.order - b.order)
  }

  /**
   * Get count of uncompleted todos
   *
   * @param todoList - The todo list to count from
   * @returns Number of uncompleted todos
   */
  getUncompletedCount(todoList: TodoList): number {
    return todoList.items.filter((item) => !item.completed).length
  }
}
