import { describe, it, expect } from 'vitest'
import { TimeFormatter } from '../TimeFormatter'

describe('TimeFormatter', () => {
  const formatter = new TimeFormatter()

  describe('時段判斷', () => {
    it('00:00-05:59 應該是凌晨', () => {
      const cases = [
        new Date(2024, 0, 1, 0, 0),
        new Date(2024, 0, 1, 3, 30),
        new Date(2024, 0, 1, 5, 59),
      ]
      cases.forEach((date) => {
        expect(formatter.format(date)).toContain('凌晨')
      })
    })

    it('06:00-11:59 應該是上午', () => {
      const cases = [
        new Date(2024, 0, 1, 6, 0),
        new Date(2024, 0, 1, 9, 30),
        new Date(2024, 0, 1, 11, 59),
      ]
      cases.forEach((date) => {
        expect(formatter.format(date)).toContain('上午')
      })
    })

    it('12:00-17:59 應該是下午', () => {
      const cases = [
        new Date(2024, 0, 1, 12, 0),
        new Date(2024, 0, 1, 15, 30),
        new Date(2024, 0, 1, 17, 59),
      ]
      cases.forEach((date) => {
        expect(formatter.format(date)).toContain('下午')
      })
    })

    it('18:00-23:59 應該是晚上', () => {
      const cases = [
        new Date(2024, 0, 1, 18, 0),
        new Date(2024, 0, 1, 21, 30),
        new Date(2024, 0, 1, 23, 59),
      ]
      cases.forEach((date) => {
        expect(formatter.format(date)).toContain('晚上')
      })
    })
  })

  describe('小時格式化', () => {
    it('12 點應該顯示為 12 點', () => {
      const noon = new Date(2024, 0, 1, 12, 0)
      expect(formatter.format(noon)).toContain('12 點')
    })

    it('0 點應該顯示為 12 點（凌晨）', () => {
      const midnight = new Date(2024, 0, 1, 0, 0)
      expect(formatter.format(midnight)).toContain('12 點')
      expect(formatter.format(midnight)).toContain('凌晨')
    })

    it('13 點應該顯示為 1 點（下午）', () => {
      const afternoon = new Date(2024, 0, 1, 13, 30)
      expect(formatter.format(afternoon)).toContain('1 點')
      expect(formatter.format(afternoon)).toContain('下午')
    })
  })

  describe('分鐘格式化', () => {
    it('整點應該顯示「點整」', () => {
      const result = formatter.format(new Date(2024, 0, 1, 10, 0))
      expect(result).toContain('點整')
      expect(result).not.toContain('分')
    })

    it('非整點應該顯示分鐘', () => {
      const result = formatter.format(new Date(2024, 0, 1, 10, 30))
      expect(result).toContain('30 分')
    })

    it('1 分應該顯示為 1 分', () => {
      const result = formatter.format(new Date(2024, 0, 1, 10, 1))
      expect(result).toContain('1 分')
    })
  })

  describe('完整格式', () => {
    it('應該以「現在時間」開頭', () => {
      const result = formatter.format(new Date())
      expect(result).toMatch(/^現在時間/)
    })

    it('上午 10 點 30 分應該正確格式化', () => {
      const result = formatter.format(new Date(2024, 0, 1, 10, 30))
      expect(result).toBe('現在時間 上午 10 點 30 分')
    })

    it('下午 3 點整應該正確格式化', () => {
      const result = formatter.format(new Date(2024, 0, 1, 15, 0))
      expect(result).toBe('現在時間 下午 3 點整')
    })

    it('凌晨 12 點整應該正確格式化', () => {
      const result = formatter.format(new Date(2024, 0, 1, 0, 0))
      expect(result).toBe('現在時間 凌晨 12 點整')
    })

    it('晚上 9 點 45 分應該正確格式化', () => {
      const result = formatter.format(new Date(2024, 0, 1, 21, 45))
      expect(result).toBe('現在時間 晚上 9 點 45 分')
    })
  })
})
