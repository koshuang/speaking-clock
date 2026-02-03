import type { GoalList } from '../../domain/entities/UltimateGoal'
import { DEFAULT_GOAL_LIST } from '../../domain/entities/UltimateGoal'
import type { UltimateGoalRepository } from '../../domain/ports/UltimateGoalRepository'

const STORAGE_KEY = 'speaking-clock-ultimate-goals'

export class LocalStorageUltimateGoalRepository implements UltimateGoalRepository {
  load(): GoalList {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_GOAL_LIST, ...JSON.parse(saved) }
      }
    } catch {
      console.error('無法讀取終極目標')
    }
    return DEFAULT_GOAL_LIST
  }

  save(goalList: GoalList): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goalList))
    } catch {
      console.error('無法儲存終極目標')
    }
  }
}
