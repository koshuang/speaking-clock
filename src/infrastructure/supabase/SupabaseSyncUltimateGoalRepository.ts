import type { GoalList } from '../../domain/entities/UltimateGoal'
import { DEFAULT_GOAL_LIST } from '../../domain/entities/UltimateGoal'
import type { UltimateGoalRepository } from '../../domain/ports/UltimateGoalRepository'
import { supabase } from './client'

const LOCAL_STORAGE_KEY = 'speaking-clock-ultimate-goals'

/**
 * Hybrid Ultimate Goal Repository - localStorage + Supabase sync
 *
 * Strategy:
 * - Read: First from localStorage (fast), then sync from cloud in background
 * - Write: Write to localStorage immediately, then sync to cloud
 * - Offline: Falls back to localStorage only
 */
export class SupabaseSyncUltimateGoalRepository implements UltimateGoalRepository {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
    // Trigger initial sync from cloud
    this.syncFromCloud()
  }

  load(): GoalList {
    // Always return from localStorage first for fast UI
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_GOAL_LIST, ...JSON.parse(saved) }
      }
    } catch {
      console.error('無法讀取終極目標')
    }
    return DEFAULT_GOAL_LIST
  }

  save(goalList: GoalList): void {
    // Save to localStorage first for immediate response
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goalList))
    } catch {
      console.error('無法儲存終極目標到本地')
    }

    // Sync to cloud in background
    this.syncToCloud(goalList)
  }

  private async syncFromCloud(): Promise<void> {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('user_ultimate_goals')
        .select('goals, updated_at')
        .eq('user_id', this.userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found - upload local data to cloud
          const localGoals = this.load()
          await this.syncToCloud(localGoals)
        }
        return
      }

      if (data?.goals) {
        // Compare timestamps if available, or just use cloud data
        const cloudGoals = data.goals as GoalList
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudGoals))
      }
    } catch {
      console.error('無法從雲端同步終極目標')
    }
  }

  private async syncToCloud(goalList: GoalList): Promise<void> {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('user_ultimate_goals')
        .upsert({
          user_id: this.userId,
          goals: goalList,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('無法同步終極目標到雲端:', error.message)
      }
    } catch {
      console.error('無法同步終極目標到雲端')
    }
  }
}
