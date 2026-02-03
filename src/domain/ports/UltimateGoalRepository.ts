import type { GoalList } from '../entities/UltimateGoal'

export interface UltimateGoalRepository {
  load(): GoalList
  save(goalList: GoalList): void
}
