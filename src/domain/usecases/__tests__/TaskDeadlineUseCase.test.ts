import { describe, it, expect } from 'vitest'
import { TaskDeadlineUseCase } from '../TaskDeadlineUseCase'

describe('TaskDeadlineUseCase', () => {
  const useCase = new TaskDeadlineUseCase()

  describe('getMinutesUntilDeadline', () => {
    it('should return positive minutes when deadline is in the future', () => {
      // Set up: current time 10:00, deadline 10:30
      const now = new Date('2024-01-15T10:00:00')
      const result = useCase.getMinutesUntilDeadline('10:30', now)
      expect(result).toBe(30)
    })

    it('should return negative minutes when deadline has passed', () => {
      // Set up: current time 10:30, deadline 10:00
      const now = new Date('2024-01-15T10:30:00')
      const result = useCase.getMinutesUntilDeadline('10:00', now)
      expect(result).toBe(-30)
    })

    it('should return 0 when deadline is exactly now', () => {
      const now = new Date('2024-01-15T10:00:00')
      const result = useCase.getMinutesUntilDeadline('10:00', now)
      expect(result).toBe(0)
    })

    it('should handle midnight crossover - deadline after midnight when current time is before midnight', () => {
      // Set up: current time 23:30, deadline 00:30 (next day)
      const now = new Date('2024-01-15T23:30:00')
      const result = useCase.getMinutesUntilDeadline('00:30', now)
      // 00:30 tomorrow - 23:30 today = 60 minutes
      expect(result).toBe(60)
    })

    it('should handle midnight crossover - deadline 00:58 when current time is 23:51', () => {
      // The bug case: current time 23:51, deadline 00:58 (next day)
      const now = new Date('2024-01-15T23:51:00')
      const result = useCase.getMinutesUntilDeadline('00:58', now)
      // 00:58 tomorrow - 23:51 today = 67 minutes
      expect(result).toBe(67)
    })

    it('should NOT assume next day for deadline that is only a few hours behind', () => {
      // Set up: current time 14:00, deadline 10:00 (same day, 4 hours ago)
      // This should be -240 minutes (4 hours overdue), not next day
      const now = new Date('2024-01-15T14:00:00')
      const result = useCase.getMinutesUntilDeadline('10:00', now)
      expect(result).toBe(-240)
    })
  })

  describe('isOverdue', () => {
    it('should return true when deadline has passed', () => {
      const now = new Date('2024-01-15T10:30:00')
      expect(useCase.isOverdue('10:00', now)).toBe(true)
    })

    it('should return false when deadline is in the future', () => {
      const now = new Date('2024-01-15T10:00:00')
      expect(useCase.isOverdue('10:30', now)).toBe(false)
    })

    it('should return false when deadline is exactly now', () => {
      const now = new Date('2024-01-15T10:00:00')
      expect(useCase.isOverdue('10:00', now)).toBe(false)
    })
  })

  describe('generateDeadlineReminder', () => {
    it('should generate overdue message when deadline has passed', () => {
      const now = new Date('2024-01-15T10:30:00')
      const result = useCase.generateDeadlineReminder('刷牙', '10:00', now)
      expect(result).toBe('刷牙已經超過30分鐘了')
    })

    it('should generate "time is up" message when deadline is exactly now', () => {
      const now = new Date('2024-01-15T10:00:00')
      const result = useCase.generateDeadlineReminder('刷牙', '10:00', now)
      expect(result).toBe('刷牙時間到了')
    })

    it('should generate remaining time message when deadline is in the future', () => {
      const now = new Date('2024-01-15T10:00:00')
      const result = useCase.generateDeadlineReminder('刷牙', '10:15', now)
      expect(result).toBe('還有15分鐘要完成刷牙')
    })
  })

  describe('isDeadlineApproaching', () => {
    it('should return true when deadline is within threshold', () => {
      const now = new Date('2024-01-15T10:00:00')
      // Deadline in 10 minutes, threshold 15 minutes
      expect(useCase.isDeadlineApproaching('10:10', 15, now)).toBe(true)
    })

    it('should return true when deadline is exactly at threshold', () => {
      const now = new Date('2024-01-15T10:00:00')
      // Deadline in 15 minutes, threshold 15 minutes
      expect(useCase.isDeadlineApproaching('10:15', 15, now)).toBe(true)
    })

    it('should return false when deadline is beyond threshold', () => {
      const now = new Date('2024-01-15T10:00:00')
      // Deadline in 20 minutes, threshold 15 minutes
      expect(useCase.isDeadlineApproaching('10:20', 15, now)).toBe(false)
    })

    it('should return true when deadline has passed (overdue)', () => {
      const now = new Date('2024-01-15T10:30:00')
      // Deadline was 30 minutes ago
      expect(useCase.isDeadlineApproaching('10:00', 15, now)).toBe(true)
    })

    it('should use default threshold of 15 minutes', () => {
      const now = new Date('2024-01-15T10:00:00')
      // Deadline in 10 minutes
      expect(useCase.isDeadlineApproaching('10:10', undefined, now)).toBe(true)
      // Deadline in 20 minutes
      expect(useCase.isDeadlineApproaching('10:20', undefined, now)).toBe(false)
    })
  })
})
