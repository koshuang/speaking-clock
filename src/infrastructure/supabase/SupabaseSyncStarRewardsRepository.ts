import type { StarRewardsState } from '../../domain/entities/StarRewards'
import { DEFAULT_STAR_REWARDS } from '../../domain/entities/StarRewards'
import type { StarRewardsRepository } from '../../domain/ports/StarRewardsRepository'
import { supabase } from './client'

const LOCAL_STORAGE_KEY = 'speaking-clock-star-rewards'

/**
 * Hybrid Star Rewards Repository - localStorage + Supabase sync
 *
 * Strategy:
 * - Read: First from localStorage (fast), then sync from cloud in background
 * - Write: Write to localStorage immediately, then sync to cloud
 * - Offline: Falls back to localStorage only
 */
export class SupabaseSyncStarRewardsRepository implements StarRewardsRepository {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
    // Trigger initial sync from cloud
    this.syncFromCloud()
  }

  load(): StarRewardsState {
    // Always return from localStorage first for fast UI
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_STAR_REWARDS, ...JSON.parse(saved) }
      }
    } catch {
      console.error('無法讀取星星獎勵資料')
    }
    return DEFAULT_STAR_REWARDS
  }

  save(state: StarRewardsState): void {
    // Save to localStorage first for immediate response
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
    } catch {
      console.error('無法儲存星星獎勵資料到本地')
    }

    // Sync to cloud in background
    this.syncToCloud(state)
  }

  private async syncFromCloud(): Promise<void> {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('user_star_rewards')
        .select('rewards, updated_at')
        .eq('user_id', this.userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found - upload local data to cloud
          const localRewards = this.load()
          if (localRewards.totalStars > 0) {
            await this.syncToCloud(localRewards)
          }
        }
        return
      }

      if (data?.rewards) {
        const cloudRewards = data.rewards as StarRewardsState
        const localRewards = this.load()

        // Conflict resolution: keep the one with more total stars
        // This prevents data loss when syncing between devices
        if (cloudRewards.totalStars >= localRewards.totalStars) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudRewards))
        } else {
          // Local has more stars, sync local to cloud
          await this.syncToCloud(localRewards)
        }
      }
    } catch {
      console.error('無法從雲端同步星星獎勵資料')
    }
  }

  private async syncToCloud(state: StarRewardsState): Promise<void> {
    if (!supabase) return

    try {
      // First check if cloud has more stars (conflict resolution)
      const { data: existingData } = await supabase
        .from('user_star_rewards')
        .select('rewards')
        .eq('user_id', this.userId)
        .single()

      if (existingData?.rewards) {
        const cloudRewards = existingData.rewards as StarRewardsState
        // Don't overwrite if cloud has more stars
        if (cloudRewards.totalStars > state.totalStars) {
          // Instead, update local with cloud data
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudRewards))
          return
        }
      }

      const { error } = await supabase
        .from('user_star_rewards')
        .upsert({
          user_id: this.userId,
          rewards: state,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('無法同步星星獎勵資料到雲端:', error.message)
      }
    } catch {
      console.error('無法同步星星獎勵資料到雲端')
    }
  }
}
