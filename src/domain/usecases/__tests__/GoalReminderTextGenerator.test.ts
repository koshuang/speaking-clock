import { describe, it, expect, beforeEach } from 'vitest'
import { GoalReminderTextGenerator } from '../GoalReminderTextGenerator'

describe('GoalReminderTextGenerator', () => {
  let generator: GoalReminderTextGenerator

  beforeEach(() => {
    generator = new GoalReminderTextGenerator()
  })

  describe('generateDeadlineWarning', () => {
    it('5分鐘內應該提示加快腳步', () => {
      const result = generator.generateDeadlineWarning('出門', 5)

      expect(result).toBe('距離出門還有5分鐘，請加快腳步')
    })

    it('1分鐘時應該提示加快腳步', () => {
      const result = generator.generateDeadlineWarning('出門', 1)

      expect(result).toBe('距離出門還有1分鐘，請加快腳步')
    })

    it('3分鐘時應該提示加快腳步', () => {
      const result = generator.generateDeadlineWarning('上課', 3)

      expect(result).toBe('距離上課還有3分鐘，請加快腳步')
    })

    it('15分鐘內應該給予提醒', () => {
      const result = generator.generateDeadlineWarning('出門', 15)

      expect(result).toBe('距離出門還有15分鐘')
    })

    it('10分鐘時應該給予提醒', () => {
      const result = generator.generateDeadlineWarning('上學', 10)

      expect(result).toBe('距離上學還有10分鐘')
    })

    it('6分鐘時應該給予提醒', () => {
      const result = generator.generateDeadlineWarning('開會', 6)

      expect(result).toBe('距離開會還有6分鐘')
    })

    it('超過15分鐘應該提示開始準備', () => {
      const result = generator.generateDeadlineWarning('出門', 30)

      expect(result).toBe('距離出門還有30分鐘，請開始準備')
    })

    it('20分鐘時應該提示開始準備', () => {
      const result = generator.generateDeadlineWarning('面試', 20)

      expect(result).toBe('距離面試還有20分鐘，請開始準備')
    })

    it('60分鐘時應該提示開始準備', () => {
      const result = generator.generateDeadlineWarning('演講', 60)

      expect(result).toBe('距離演講還有60分鐘，請開始準備')
    })

    it('應該正確處理不同的目標名稱', () => {
      const result1 = generator.generateDeadlineWarning('上班', 5)
      const result2 = generator.generateDeadlineWarning('約會', 15)
      const result3 = generator.generateDeadlineWarning('健身', 30)

      expect(result1).toContain('上班')
      expect(result2).toContain('約會')
      expect(result3).toContain('健身')
    })
  })

  describe('generateStartSuggestion', () => {
    it('應該生成開始時間建議', () => {
      const startTime = new Date()
      startTime.setHours(7, 35, 0, 0)

      const result = generator.generateStartSuggestion('出門', startTime, 15)

      expect(result).toBe('為了出門，建議07:35開始準備，共需15分鐘')
    })

    it('應該正確格式化個位數小時', () => {
      const startTime = new Date()
      startTime.setHours(8, 5, 0, 0)

      const result = generator.generateStartSuggestion('上學', startTime, 20)

      expect(result).toBe('為了上學，建議08:05開始準備，共需20分鐘')
    })

    it('應該正確格式化雙位數小時', () => {
      const startTime = new Date()
      startTime.setHours(14, 30, 0, 0)

      const result = generator.generateStartSuggestion('開會', startTime, 45)

      expect(result).toBe('為了開會，建議14:30開始準備，共需45分鐘')
    })

    it('應該處理零分鐘', () => {
      const startTime = new Date()
      startTime.setHours(10, 0, 0, 0)

      const result = generator.generateStartSuggestion('面試', startTime, 30)

      expect(result).toBe('為了面試，建議10:00開始準備，共需30分鐘')
    })

    it('應該正確處理午夜時間', () => {
      const startTime = new Date()
      startTime.setHours(0, 15, 0, 0)

      const result = generator.generateStartSuggestion('值班', startTime, 10)

      expect(result).toBe('為了值班，建議00:15開始準備，共需10分鐘')
    })

    it('應該處理不同的總時長', () => {
      const startTime = new Date()
      startTime.setHours(7, 0, 0, 0)

      const result1 = generator.generateStartSuggestion('出門', startTime, 5)
      const result2 = generator.generateStartSuggestion('出門', startTime, 60)
      const result3 = generator.generateStartSuggestion('出門', startTime, 120)

      expect(result1).toContain('共需5分鐘')
      expect(result2).toContain('共需60分鐘')
      expect(result3).toContain('共需120分鐘')
    })
  })

  describe('generateOverdueWarning', () => {
    it('應該生成超時警告訊息', () => {
      const result = generator.generateOverdueWarning('出門', 10)

      expect(result).toBe('已經超過出門時間10分鐘了')
    })

    it('超過1分鐘應該提示', () => {
      const result = generator.generateOverdueWarning('上課', 1)

      expect(result).toBe('已經超過上課時間1分鐘了')
    })

    it('超過30分鐘應該提示', () => {
      const result = generator.generateOverdueWarning('開會', 30)

      expect(result).toBe('已經超過開會時間30分鐘了')
    })

    it('超過1小時應該提示', () => {
      const result = generator.generateOverdueWarning('約會', 60)

      expect(result).toBe('已經超過約會時間60分鐘了')
    })

    it('應該正確處理不同的目標名稱', () => {
      const result1 = generator.generateOverdueWarning('上班', 5)
      const result2 = generator.generateOverdueWarning('演講', 15)
      const result3 = generator.generateOverdueWarning('飛機起飛', 20)

      expect(result1).toContain('上班')
      expect(result2).toContain('演講')
      expect(result3).toContain('飛機起飛')
    })
  })

  describe('generateProgressUpdate', () => {
    it('應該生成進度更新訊息', () => {
      const result = generator.generateProgressUpdate(2, 5)

      expect(result).toBe('目前進度：2/5項完成')
    })

    it('全部完成時應該顯示完整進度', () => {
      const result = generator.generateProgressUpdate(5, 5)

      expect(result).toBe('目前進度：5/5項完成')
    })

    it('剛開始時應該顯示零進度', () => {
      const result = generator.generateProgressUpdate(0, 10)

      expect(result).toBe('目前進度：0/10項完成')
    })

    it('只有一項任務時應該正確顯示', () => {
      const result1 = generator.generateProgressUpdate(0, 1)
      const result2 = generator.generateProgressUpdate(1, 1)

      expect(result1).toBe('目前進度：0/1項完成')
      expect(result2).toBe('目前進度：1/1項完成')
    })

    it('應該處理較大的數字', () => {
      const result = generator.generateProgressUpdate(45, 100)

      expect(result).toBe('目前進度：45/100項完成')
    })

    it('應該顯示正確的格式', () => {
      const result = generator.generateProgressUpdate(3, 7)

      expect(result).toContain('目前進度：')
      expect(result).toContain('項完成')
      expect(result).toContain('3/7')
    })
  })
})
