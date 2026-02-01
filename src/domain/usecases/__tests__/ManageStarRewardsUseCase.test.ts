import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ManageStarRewardsUseCase } from '../ManageStarRewardsUseCase'
import type { StarRewardsState } from '../../entities/StarRewards'
import { DEFAULT_STAR_REWARDS } from '../../entities/StarRewards'
import { STAR_REWARD_RULES } from '../../entities/StarRewardRules'
import type { StarRewardsRepository } from '../../ports/StarRewardsRepository'

describe('ManageStarRewardsUseCase', () => {
  let useCase: ManageStarRewardsUseCase
  let mockRepository: StarRewardsRepository
  let savedState: StarRewardsState

  beforeEach(() => {
    savedState = { ...DEFAULT_STAR_REWARDS }
    mockRepository = {
      load: vi.fn(() => savedState),
      save: vi.fn((state) => { savedState = state }),
    }
    useCase = new ManageStarRewardsUseCase(mockRepository)
  })

  describe('load', () => {
    it('should load state from repository', () => {
      const state = useCase.load()
      expect(mockRepository.load).toHaveBeenCalled()
      expect(state).toBeDefined()
    })

    it('should reset today stars when date changes', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      savedState = {
        ...DEFAULT_STAR_REWARDS,
        todayStars: 5,
        totalStars: 10,
        lastUpdated: yesterday.toISOString().split('T')[0],
      }

      const state = useCase.load()

      expect(state.todayStars).toBe(0)
      expect(state.totalStars).toBe(10) // Total should remain
      expect(state.currentCombo).toBe(0) // Combo should reset
    })
  })

  describe('addStarsForCompletion', () => {
    it('should add 1 star for completing a task', () => {
      const result = useCase.addStarsForCompletion(savedState, false)

      expect(result.starsEarned).toBe(STAR_REWARD_RULES.TASK_COMPLETE)
      expect(result.state.todayStars).toBe(1)
      expect(result.state.totalStars).toBe(1)
      expect(result.hasComboBonus).toBe(false)
    })

    it('should add bonus star for on-time completion', () => {
      const result = useCase.addStarsForCompletion(savedState, true)

      const expected = STAR_REWARD_RULES.TASK_COMPLETE + STAR_REWARD_RULES.ON_TIME_BONUS
      expect(result.starsEarned).toBe(expected)
      expect(result.state.todayStars).toBe(expected)
    })

    it('should track combo count', () => {
      const state = savedState

      const result1 = useCase.addStarsForCompletion(state, false)
      expect(result1.state.currentCombo).toBe(1)

      const result2 = useCase.addStarsForCompletion(result1.state, false)
      expect(result2.state.currentCombo).toBe(2)
    })

    it('should give combo bonus every 3 completions', () => {
      const state = savedState

      // Complete 2 tasks (no bonus)
      const result1 = useCase.addStarsForCompletion(state, false)
      expect(result1.hasComboBonus).toBe(false)

      const result2 = useCase.addStarsForCompletion(result1.state, false)
      expect(result2.hasComboBonus).toBe(false)

      // Complete 3rd task (bonus!)
      const result3 = useCase.addStarsForCompletion(result2.state, false)
      expect(result3.hasComboBonus).toBe(true)
      expect(result3.starsEarned).toBe(STAR_REWARD_RULES.TASK_COMPLETE + STAR_REWARD_RULES.COMBO_3_BONUS)

      // 4th and 5th no bonus
      const result4 = useCase.addStarsForCompletion(result3.state, false)
      expect(result4.hasComboBonus).toBe(false)

      const result5 = useCase.addStarsForCompletion(result4.state, false)
      expect(result5.hasComboBonus).toBe(false)

      // 6th task (another bonus!)
      const result6 = useCase.addStarsForCompletion(result5.state, false)
      expect(result6.hasComboBonus).toBe(true)
    })

    it('should save state after adding stars', () => {
      useCase.addStarsForCompletion(savedState, false)
      expect(mockRepository.save).toHaveBeenCalled()
    })
  })

  describe('addDailyCompletionBonus', () => {
    it('should add daily completion bonus stars', () => {
      const result = useCase.addDailyCompletionBonus(savedState)

      expect(result.starsEarned).toBe(STAR_REWARD_RULES.DAILY_COMPLETE_BONUS)
      expect(result.state.todayStars).toBe(STAR_REWARD_RULES.DAILY_COMPLETE_BONUS)
      expect(result.state.totalStars).toBe(STAR_REWARD_RULES.DAILY_COMPLETE_BONUS)
    })
  })

  describe('resetCombo', () => {
    it('should reset combo count to 0', () => {
      savedState = { ...savedState, currentCombo: 5 }
      const newState = useCase.resetCombo(savedState)

      expect(newState.currentCombo).toBe(0)
    })
  })

  describe('getDailyProgress', () => {
    it('should calculate progress percentage correctly', () => {
      savedState = { ...savedState, todayStars: 5, dailyGoal: 10 }
      expect(useCase.getDailyProgress(savedState)).toBe(50)
    })

    it('should cap progress at 100%', () => {
      savedState = { ...savedState, todayStars: 15, dailyGoal: 10 }
      expect(useCase.getDailyProgress(savedState)).toBe(100)
    })

    it('should return 100% when goal is 0', () => {
      savedState = { ...savedState, dailyGoal: 0 }
      expect(useCase.getDailyProgress(savedState)).toBe(100)
    })
  })

  describe('getTodayRecord', () => {
    it('should return today record with correct values', () => {
      savedState = { ...savedState, todayStars: 7, currentCombo: 3 }
      const record = useCase.getTodayRecord(savedState)

      expect(record.earned).toBe(7)
      expect(record.comboCount).toBe(3)
      expect(record.date).toBe(new Date().toISOString().split('T')[0])
    })
  })

  describe('updateDailyGoal', () => {
    it('should update daily goal', () => {
      const newState = useCase.updateDailyGoal(savedState, 15)
      expect(newState.dailyGoal).toBe(15)
    })

    it('should enforce minimum goal of 1', () => {
      const newState = useCase.updateDailyGoal(savedState, 0)
      expect(newState.dailyGoal).toBe(1)
    })
  })
})
