import { describe, it, expect } from 'vitest'
import { DisplayTimeFormatter } from '../DisplayTimeFormatter'

describe('DisplayTimeFormatter', () => {
  const formatter = new DisplayTimeFormatter()

  describe('formatTime', () => {
    it('should format time in HH:MM:SS format', () => {
      const date = new Date(2024, 0, 1, 14, 30, 45)
      const result = formatter.formatTime(date)
      expect(result).toMatch(/14:30:45/)
    })

    it('should pad single digit hours', () => {
      const date = new Date(2024, 0, 1, 9, 5, 3)
      const result = formatter.formatTime(date)
      expect(result).toMatch(/09:05:03/)
    })

    it('should use 24-hour format', () => {
      const date = new Date(2024, 0, 1, 23, 59, 59)
      const result = formatter.formatTime(date)
      expect(result).toMatch(/23:59:59/)
    })

    it('should handle midnight', () => {
      const date = new Date(2024, 0, 1, 0, 0, 0)
      const result = formatter.formatTime(date)
      expect(result).toMatch(/00:00:00/)
    })
  })

  describe('formatDate', () => {
    it('should format date with year, month, day, and weekday', () => {
      const date = new Date(2024, 0, 15) // January 15, 2024 (Monday)
      const result = formatter.formatDate(date)
      expect(result).toContain('2024')
      expect(result).toContain('1')
      expect(result).toContain('15')
    })

    it('should include weekday', () => {
      const date = new Date(2024, 0, 1) // Monday
      const result = formatter.formatDate(date)
      // Should contain weekday in Chinese
      expect(result).toMatch(/星期/)
    })
  })

  describe('formatTimeShort', () => {
    it('should format time without seconds', () => {
      const date = new Date(2024, 0, 1, 14, 30, 45)
      const result = formatter.formatTimeShort(date)
      expect(result).toMatch(/14:30/)
      expect(result).not.toContain('45')
    })

    it('should pad single digit values', () => {
      const date = new Date(2024, 0, 1, 9, 5, 0)
      const result = formatter.formatTimeShort(date)
      expect(result).toMatch(/09:05/)
    })
  })
})
