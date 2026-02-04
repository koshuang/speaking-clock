import { describe, it, expect } from 'vitest'
import { TaskCompletionUseCase } from '../TaskCompletionUseCase'
import type { Todo, TodoList } from '../../entities/Todo'

describe('TaskCompletionUseCase', () => {
  const useCase = new TaskCompletionUseCase()

  const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
    id: '1',
    text: '測試任務',
    completed: false,
    order: 0,
    createdAt: Date.now(),
    ...overrides,
  })

  describe('isCompletedOnTime', () => {
    it('should return true for timed task with remaining time > 0', () => {
      expect(useCase.isCompletedOnTime(true, 60)).toBe(true)
    })

    it('should return false for timed task with remaining time = 0', () => {
      expect(useCase.isCompletedOnTime(true, 0)).toBe(false)
    })

    it('should return false for timed task with remaining time < 0', () => {
      expect(useCase.isCompletedOnTime(true, -10)).toBe(false)
    })

    it('should always return true for non-timed task', () => {
      expect(useCase.isCompletedOnTime(false, 0)).toBe(true)
      expect(useCase.isCompletedOnTime(false, -100)).toBe(true)
      expect(useCase.isCompletedOnTime(false, 100)).toBe(true)
    })
  })

  describe('willCompleteAllTasks', () => {
    it('should return true when completing the last uncompleted task', () => {
      const todoList: TodoList = {
        items: [
          createTodo({ id: '1', completed: true }),
          createTodo({ id: '2', completed: true }),
          createTodo({ id: '3', completed: false }),
        ],
      }
      expect(useCase.willCompleteAllTasks(todoList, '3')).toBe(true)
    })

    it('should return false when there are still uncompleted tasks', () => {
      const todoList: TodoList = {
        items: [
          createTodo({ id: '1', completed: true }),
          createTodo({ id: '2', completed: false }),
          createTodo({ id: '3', completed: false }),
        ],
      }
      expect(useCase.willCompleteAllTasks(todoList, '2')).toBe(false)
    })

    it('should return false for empty list', () => {
      const todoList: TodoList = { items: [] }
      expect(useCase.willCompleteAllTasks(todoList, '1')).toBe(false)
    })

    it('should return true for single task list', () => {
      const todoList: TodoList = {
        items: [createTodo({ id: '1', completed: false })],
      }
      expect(useCase.willCompleteAllTasks(todoList, '1')).toBe(true)
    })
  })

  describe('isActiveTimedTask', () => {
    it('should return true when todo is active and has duration', () => {
      const todo = createTodo({ id: '1', durationMinutes: 30 })
      expect(useCase.isActiveTimedTask(todo, '1')).toBe(true)
    })

    it('should return false when todo is not active', () => {
      const todo = createTodo({ id: '1', durationMinutes: 30 })
      expect(useCase.isActiveTimedTask(todo, '2')).toBe(false)
    })

    it('should return false when todo has no duration', () => {
      const todo = createTodo({ id: '1', durationMinutes: undefined })
      expect(useCase.isActiveTimedTask(todo, '1')).toBe(false)
    })

    it('should return false when active todo id is null', () => {
      const todo = createTodo({ id: '1', durationMinutes: 30 })
      expect(useCase.isActiveTimedTask(todo, null)).toBe(false)
    })
  })

  describe('canComplete', () => {
    it('should return true for uncompleted todo', () => {
      const todo = createTodo({ completed: false })
      expect(useCase.canComplete(todo)).toBe(true)
    })

    it('should return false for completed todo', () => {
      const todo = createTodo({ completed: true })
      expect(useCase.canComplete(todo)).toBe(false)
    })

    it('should return false for undefined todo', () => {
      expect(useCase.canComplete(undefined)).toBe(false)
    })
  })

  describe('canUncomplete', () => {
    it('should return true for completed todo', () => {
      const todo = createTodo({ completed: true })
      expect(useCase.canUncomplete(todo)).toBe(true)
    })

    it('should return false for uncompleted todo', () => {
      const todo = createTodo({ completed: false })
      expect(useCase.canUncomplete(todo)).toBe(false)
    })

    it('should return false for undefined todo', () => {
      expect(useCase.canUncomplete(undefined)).toBe(false)
    })
  })
})
