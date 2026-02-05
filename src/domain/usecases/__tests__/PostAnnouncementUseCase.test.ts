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

    it('should remind to complete when active task time is up', () => {
      const activeTodo = createTodo({ durationMinutes: 30 })
      const nextTodo = createTodo({ id: '2', text: '下一個' })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 0,
        nextUncompletedTodo: nextTodo,
      })

      expect(result.type).toBe('active_task')
      expect(result.message).toContain('時間已到')
      expect(result.message).toContain('請完成任務')
      expect(result.todo).toBe(activeTodo)
    })

    it('should move to next todo when no active task', () => {
      const nextTodo = createTodo({ id: '2', text: '下一個' })
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: nextTodo,
      })

      expect(result.type).toBe('next_todo')
      expect(result.todo).toBe(nextTodo)
    })

    it('should announce elapsed time for active task without duration', () => {
      const activeTodo = createTodo({ durationMinutes: undefined })
      const nextTodo = createTodo({ id: '2', text: '下一個' })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 900, // 15 minutes elapsed
        nextUncompletedTodo: nextTodo,
      })

      expect(result.type).toBe('active_task')
      expect(result.message).toBe('測試任務已進行15分鐘')
      expect(result.todo).toBe(activeTodo)
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

  describe('goal reminder integration', () => {
    it('should append goal reminder to active task message when goal <= 30 min', () => {
      const activeTodo = createTodo({ text: '寫功課', durationMinutes: 30 })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 900, // 15 minutes
        nextUncompletedTodo: null,
        activeGoal: { name: '出門', targetTime: '08:00' },
        goalTimeUntilDeadline: 20,
      })

      expect(result.type).toBe('active_task')
      expect(result.message).toContain('寫功課')
      expect(result.message).toContain('出門')
      expect(result.message).toContain('20分鐘')
    })

    it('should include goal reminder when goal > 30 min away', () => {
      const activeTodo = createTodo({ text: '寫功課', durationMinutes: 30 })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 900,
        nextUncompletedTodo: null,
        activeGoal: { name: '出門', targetTime: '08:00' },
        goalTimeUntilDeadline: 45, // > 30 minutes - still included
      })

      expect(result.type).toBe('active_task')
      expect(result.message).toContain('寫功課')
      expect(result.message).toContain('出門')
      expect(result.message).toContain('45分鐘')
    })

    it('should append goal reminder to next todo message when goal <= 30 min', () => {
      const nextTodo = createTodo({ text: '練鋼琴' })
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: nextTodo,
        activeGoal: { name: '上學', targetTime: '07:50' },
        goalTimeUntilDeadline: 15,
      })

      expect(result.type).toBe('next_todo')
      expect(result.message).toContain('練鋼琴')
      expect(result.message).toContain('上學')
      expect(result.message).toContain('15分鐘')
    })

    it('should return goal-only message when no task but goal <= 30 min', () => {
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: null,
        activeGoal: { name: '出門', targetTime: '08:00' },
        goalTimeUntilDeadline: 10,
      })

      expect(result.type).toBe('goal')
      expect(result.message).toContain('出門')
      expect(result.message).toContain('10分鐘')
      expect(result.todo).toBeNull()
    })

    it('should return goal when no task and goal > 30 min', () => {
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: null,
        activeGoal: { name: '出門', targetTime: '08:00' },
        goalTimeUntilDeadline: 60, // > 30 minutes - still included
      })

      expect(result.type).toBe('goal')
      expect(result.message).toContain('出門')
      expect(result.message).toContain('60分鐘')
    })

    it('should include overdue warning when goal is past deadline', () => {
      const activeTodo = createTodo({ text: '穿衣服', durationMinutes: 5 })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 180,
        nextUncompletedTodo: null,
        activeGoal: { name: '上學', targetTime: '07:50' },
        goalTimeUntilDeadline: -15, // 15 minutes overdue
      })

      expect(result.type).toBe('active_task')
      expect(result.message).toContain('穿衣服')
      expect(result.message).toContain('上學')
      expect(result.message).toContain('超過')
      expect(result.message).toContain('15分鐘')
    })

    it('should use urgent language when goal < 5 min', () => {
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: null,
        activeGoal: { name: '出門', targetTime: '08:00' },
        goalTimeUntilDeadline: 3,
      })

      expect(result.message).toContain('只剩')
      expect(result.message).toContain('3分鐘')
    })

    it('should use moderate urgency when goal 5-15 min', () => {
      const result = useCase.getNextAnnouncement({
        activeTodo: null,
        activeTaskState: null,
        remainingSeconds: 0,
        nextUncompletedTodo: null,
        activeGoal: { name: '出門', targetTime: '08:00' },
        goalTimeUntilDeadline: 10,
      })

      expect(result.message).toContain('加快準備')
    })

    it('should NOT include goal when activeGoal is null', () => {
      const activeTodo = createTodo({ text: '寫功課', durationMinutes: 30 })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 900,
        nextUncompletedTodo: null,
        activeGoal: null,
        goalTimeUntilDeadline: 20,
      })

      expect(result.message).toContain('寫功課')
      expect(result.message).not.toContain('出門')
    })

    it('should NOT include goal when goalTimeUntilDeadline is undefined', () => {
      const activeTodo = createTodo({ text: '寫功課', durationMinutes: 30 })
      const result = useCase.getNextAnnouncement({
        activeTodo,
        activeTaskState: createActiveTaskState(),
        remainingSeconds: 900,
        nextUncompletedTodo: null,
        activeGoal: { name: '出門', targetTime: '08:00' },
        goalTimeUntilDeadline: undefined,
      })

      expect(result.message).toContain('寫功課')
      expect(result.message).not.toContain('出門')
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
