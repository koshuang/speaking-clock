import type { StarRewardsState } from '../entities/StarRewards'

/**
 * Star Rewards Repository Port - 星星獎勵儲存介面
 */
export interface StarRewardsRepository {
  /**
   * 載入星星獎勵狀態
   * @returns 星星獎勵狀態
   */
  load(): StarRewardsState

  /**
   * 儲存星星獎勵狀態
   * @param state - 星星獎勵狀態
   */
  save(state: StarRewardsState): void
}
