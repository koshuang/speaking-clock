import type { StarRewardsState } from '../domain/entities/StarRewards'
import { DEFAULT_STAR_REWARDS } from '../domain/entities/StarRewards'
import type { StarRewardsRepository } from '../domain/ports/StarRewardsRepository'

const STORAGE_KEY = 'speaking-clock-star-rewards'

/**
 * LocalStorage Star Rewards Repository - 本地儲存星星獎勵實作
 */
export class LocalStorageStarRewardsRepository implements StarRewardsRepository {
  load(): StarRewardsState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_STAR_REWARDS, ...JSON.parse(saved) }
      }
    } catch {
      console.error('無法讀取星星獎勵資料')
    }
    return DEFAULT_STAR_REWARDS
  }

  save(state: StarRewardsState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      console.error('無法儲存星星獎勵資料')
    }
  }
}
