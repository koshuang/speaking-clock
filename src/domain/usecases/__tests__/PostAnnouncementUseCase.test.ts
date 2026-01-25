import { describe, it, expect } from 'vitest'
import { PostAnnouncementUseCase } from '../PostAnnouncementUseCase'
import { TaskReminderTextGenerator } from '../TaskReminderTextGenerator'
import type { Todo, ActiveTaskState } from '../../entities/Todo'

describe('PostAnnouncementUseCase', () => {
  const textGenerator = new TaskReminderTextGenerator()
  const useCase = new PostAnnouncementUseCase(textGenerator)

  const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
    id: '1',
    text: '測試任務',
    completed: false,
    order: 0,
    createdAt: Date.now(),
    ...overrides,
  })

  const createActiveTaskState = (overrides: Partial<ActiveTaskState> = {}): ActiveTaskState => ({
    todoId: '1',
    status: 'active',
    startedAt: Date.now(),
    accumulatedTime: 0,
    ...overrides,
  })

  describe('getNextAnnouncement', () => {
    it('should return active_task when task is running with remaining time', () => {
      const activeTodo = createTodo({ durationMinutes: 30 })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 900, // 15 minutes
        nextUncompletedTodo: null,
      })

      expect(result.type).toBe('active_task')
      expect(result.message).toContain('測試任務')
      expect(result.message).toContain('15')
      expect(result.todo).toBe(activeTodo)
    })

    it('should return next_todo when no active task but has next todo', () => {
      const nextTodo = createTodo({ text: '下一個任務' })
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: nextTodo,
      })

      expect(result.type).toBe('next_todo')
      expect(result.message).toContain('下一個任務')
      expect(result.todo).toBe(nextTodo)
    })

    it('should return next_todo with duration info when todo has duration', () => {
      const nextTodo = createTodo({ text: '練鋼琴', durationMinutes: 45 })
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: nextTodo,
      })

      expect(result.type).toBe('next_todo')
      expect(result.message).toContain('練鋼琴')
      expect(result.message).toContain('45')
    })

    it('should return none when no active task and no next todo', () => {
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: null,
      })

      expect(result.type).toBe('none')
      expect(result.message).toBeNull()
      expect(result.todo).toBeNull()
    })

    it('should skip active task if paused', () => {
      const activeTodo = createTodo({ durationMinutes: 30 })
      const nextTodo = createTodo({ id: '2', text: '下一個' })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState({ status: 'paused' }),
        remainingSeconds: 900,
        nextUncompletedTodo: nextTodo,
      })

      expect(result.type).toBe('next_todo')
      expect(result.todo).toBe(nextTodo)
    })

    it('should skip active task if no remaining time', () => {
      const activeTodo = createTodo({ durationMinutes: 30 })
      const nextTodo = createTodo({ id: '2', text: '下一個' })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 0,
        nextUncompletedTodo: nextTodo,
      })

      expect(result.type).toBe('next_todo')
    })

    it('should skip active task if no duration set', () => {
      const activeTodo = createTodo({ durationMinutes: undefined })
      const nextTodo = createTodo({ id: '2', text: '下一個' })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 900,
        nextUncompletedTodo: nextTodo,
      })

      expect(result.type).toBe('next_todo')
    })

    it('should prioritize active task over next todo', () => {
      const activeTodo = createTodo({ durationMinutes: 30 })
      const nextTodo = createTodo({ id: '2', text: '下一個' })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 900,
        nextUncompletedTodo: nextTodo,
      })

      expect(result.type).toBe('active_task')
      expect(result.todo).toBe(activeTodo)
    })
  })

  describe('hasAnnouncement', () => {
    it('should return true when has active task', () => {
      const result = useCase.hasAnnouncement({
        activeTodo: createTodo({ durationMinutes: 30 }),
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 900,
        nextUncompletedTodo: null,
      })
      expect(result).toBe(true)
    })

    it('should return true when has next todo', () => {
      const result = useCase.hasAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: createTodo(),
      })
      expect(result).toBe(true)
    })

    it('should return false when nothing to announce', () => {
      const result = useCase.hasAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: null,
      })
      expect(result).toBe(false)
    })
  })

  describe('childName support', () => {
    it('should prepend childName to active task message', () => {
      const activeTodo = createTodo({ text: '寫功課', durationMinutes: 30 })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 900,
        nextUncompletedTodo: null,
        childName: '小安',
      })

      expect(result.type).toBe('active_task')
      expect(result.message).toMatch(/^小安，/)
      expect(result.message).toContain('寫功課')
    })

    it('should prepend childName to next todo message', () => {
      const nextTodo = createTodo({ text: '練鋼琴' })
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: nextTodo,
        childName: '小明',
      })

      expect(result.type).toBe('next_todo')
      expect(result.message).toMatch(/^小明，/)
      expect(result.message).toContain('練鋼琴')
    })

    it('should not add prefix when childName is undefined', () => {
      const nextTodo = createTodo({ text: '練鋼琴' })
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: nextTodo,
        childName: undefined,
      })

      expect(result.type).toBe('next_todo')
      expect(result.message).not.toMatch(/^.*，/)
      expect(result.message).toMatch(/^接下來是/)
    })

    it('should not add prefix when childName is empty string', () => {
      const nextTodo = createTodo({ text: '練鋼琴' })
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: nextTodo,
        childName: '',
      })

      expect(result.type).toBe('next_todo')
      expect(result.message).toMatch(/^接下來是/)
    })
  })
})
