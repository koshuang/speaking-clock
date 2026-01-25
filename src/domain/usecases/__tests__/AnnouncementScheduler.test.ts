import { describe, it, expect } from 'vitest'
import { AnnouncementScheduler } from '../AnnouncementScheduler'

describe('AnnouncementScheduler', () => {
  const scheduler = new AnnouncementScheduler()

  describe('getNextAnnouncementTime', () => {
    it('should return current minute when at interval and within trigger window', () => {
      // 10:30:01 with 15-minute interval - should trigger now (10:30)
      const currentTime = new Date(2024, 0, 1, 10, 30, 1)
      const next = scheduler.getNextAnnouncementTime(currentTime, 15)
      expect(next.getHours()).toBe(10)
      expect(next.getMinutes()).toBe(30)
      expect(next.getSeconds()).toBe(0)
    })

    it('should return next interval when at interval but past trigger window', () => {
      // 10:30:05 with 15-minute interval - past trigger, should be 10:45
      const currentTime = new Date(2024, 0, 1, 10, 30, 5)
      const next = scheduler.getNextAnnouncementTime(currentTime, 15)
      expect(next.getHours()).toBe(10)
      expect(next.getMinutes()).toBe(45)
    })

    it('should return next interval when not at interval minute', () => {
      // 10:23:00 with 15-minute interval - should be 10:30
      const currentTime = new Date(2024, 0, 1, 10, 23, 0)
      const next = scheduler.getNextAnnouncementTime(currentTime, 15)
      expect(next.getHours()).toBe(10)
      expect(next.getMinutes()).toBe(30)
    })

    it('should handle hour rollover', () => {
      // 10:50:00 with 15-minute interval - should be 11:00
      const currentTime = new Date(2024, 0, 1, 10, 50, 0)
      const next = scheduler.getNextAnnouncementTime(currentTime, 15)
      expect(next.getHours()).toBe(11)
      expect(next.getMinutes()).toBe(0)
    })

    it('should work with 5-minute intervals', () => {
      // 10:23:00 with 5-minute interval - should be 10:25
      const currentTime = new Date(2024, 0, 1, 10, 23, 0)
      const next = scheduler.getNextAnnouncementTime(currentTime, 5)
      expect(next.getHours()).toBe(10)
      expect(next.getMinutes()).toBe(25)
    })

    it('should work with 30-minute intervals', () => {
      // 10:23:00 with 30-minute interval - should be 10:30
      const currentTime = new Date(2024, 0, 1, 10, 23, 0)
      const next = scheduler.getNextAnnouncementTime(currentTime, 30)
      expect(next.getHours()).toBe(10)
      expect(next.getMinutes()).toBe(30)
    })

    it('should work with 60-minute intervals (hourly)', () => {
      // 10:23:00 with 60-minute interval - should be 11:00
      const currentTime = new Date(2024, 0, 1, 10, 23, 0)
      const next = scheduler.getNextAnnouncementTime(currentTime, 60)
      expect(next.getHours()).toBe(11)
      expect(next.getMinutes()).toBe(0)
    })

    it('should set seconds and milliseconds to 0', () => {
      const currentTime = new Date(2024, 0, 1, 10, 23, 45, 123)
      const next = scheduler.getNextAnnouncementTime(currentTime, 15)
      expect(next.getSeconds()).toBe(0)
      expect(next.getMilliseconds()).toBe(0)
    })
  })

  describe('shouldAnnounce', () => {
    it('should return true when at interval minute and within first 2 seconds', () => {
      // 10:30:00 with 15-minute interval
      const time = new Date(2024, 0, 1, 10, 30, 0)
      expect(scheduler.shouldAnnounce(time, 15)).toBe(true)
    })

    it('should return true when at interval minute and at 1 second', () => {
      // 10:30:01 with 15-minute interval
      const time = new Date(2024, 0, 1, 10, 30, 1)
      expect(scheduler.shouldAnnounce(time, 15)).toBe(true)
    })

    it('should return false when at interval minute but past 2 seconds', () => {
      // 10:30:02 with 15-minute interval
      const time = new Date(2024, 0, 1, 10, 30, 2)
      expect(scheduler.shouldAnnounce(time, 15)).toBe(false)
    })

    it('should return false when not at interval minute', () => {
      // 10:31:00 with 15-minute interval
      const time = new Date(2024, 0, 1, 10, 31, 0)
      expect(scheduler.shouldAnnounce(time, 15)).toBe(false)
    })

    it('should work with 5-minute intervals', () => {
      const time = new Date(2024, 0, 1, 10, 25, 1)
      expect(scheduler.shouldAnnounce(time, 5)).toBe(true)
    })

    it('should work at 0 minutes (top of hour)', () => {
      const time = new Date(2024, 0, 1, 11, 0, 0)
      expect(scheduler.shouldAnnounce(time, 15)).toBe(true)
      expect(scheduler.shouldAnnounce(time, 30)).toBe(true)
      expect(scheduler.shouldAnnounce(time, 60)).toBe(true)
    })
  })

  describe('shouldTriggerAnnouncement', () => {
    it('should return true when at interval and no last spoken time', () => {
      const time = new Date(2024, 0, 1, 10, 30, 0)
      expect(scheduler.shouldTriggerAnnouncement(time, 15, null)).toBe(true)
    })

    it('should return true when at interval and last spoken was different minute', () => {
      const time = new Date(2024, 0, 1, 10, 30, 0)
      const lastSpoken = new Date(2024, 0, 1, 10, 15, 0)
      expect(scheduler.shouldTriggerAnnouncement(time, 15, lastSpoken)).toBe(true)
    })

    it('should return false when at interval but already spoken this minute', () => {
      const time = new Date(2024, 0, 1, 10, 30, 1)
      const lastSpoken = new Date(2024, 0, 1, 10, 30, 0)
      expect(scheduler.shouldTriggerAnnouncement(time, 15, lastSpoken)).toBe(false)
    })

    it('should return false when not at interval minute', () => {
      const time = new Date(2024, 0, 1, 10, 31, 0)
      expect(scheduler.shouldTriggerAnnouncement(time, 15, null)).toBe(false)
    })

    it('should return false when past trigger window', () => {
      const time = new Date(2024, 0, 1, 10, 30, 5)
      expect(scheduler.shouldTriggerAnnouncement(time, 15, null)).toBe(false)
    })

    it('should allow announcement at same minute in different hour', () => {
      const time = new Date(2024, 0, 1, 11, 30, 0)
      const lastSpoken = new Date(2024, 0, 1, 10, 30, 0)
      expect(scheduler.shouldTriggerAnnouncement(time, 15, lastSpoken)).toBe(true)
    })
  })

  describe('formatNextTime', () => {
    it('should format time in HH:MM format', () => {
      const time = new Date(2024, 0, 1, 10, 30, 0)
      const formatted = scheduler.formatNextTime(time)
      expect(formatted).toMatch(/10:30/)
    })

    it('should use 24-hour format', () => {
      const time = new Date(2024, 0, 1, 14, 30, 0)
      const formatted = scheduler.formatNextTime(time)
      expect(formatted).toMatch(/14:30/)
    })

    it('should pad single-digit hours', () => {
      const time = new Date(2024, 0, 1, 9, 15, 0)
      const formatted = scheduler.formatNextTime(time)
      expect(formatted).toMatch(/09:15/)
    })
  })
})
