import { useCallback, useState } from 'react'
import type { StarRewardsState } from '../../domain/entities/StarRewards'
import { container } from '../../di/container'

/**
 * useStarRewards Hook - 星星獎勵狀態管理
 */
export function useStarRewards() {
  const { manageStarRewardsUseCase } = container

  const [state, setState] = useState<StarRewardsState>(() => manageStarRewardsUseCase.load())
  const [lastEarned, setLastEarned] = useState<{
    stars: number
    hasComboBonus: boolean
  } | null>(null)

  /**
   * 任務完成時增加星星
   * @param isOnTime - 是否準時完成（時間內完成）
   * @returns 獲得的星星數和是否有連擊獎勵
   */
  const addStars = useCallback(
    (isOnTime: boolean) => {
      const result = manageStarRewardsUseCase.addStarsForCompletion(state, isOnTime)
      setState(result.state)
      setLastEarned({ stars: result.starsEarned, hasComboBonus: result.hasComboBonus })
      return result
    },
    [manageStarRewardsUseCase, state]
  )

  /**
   * 每日任務全部完成時的額外獎勵
   */
  const addDailyBonus = useCallback(() => {
    const result = manageStarRewardsUseCase.addDailyCompletionBonus(state)
    setState(result.state)
    setLastEarned({ stars: result.starsEarned, hasComboBonus: false })
    return result
  }, [manageStarRewardsUseCase, state])

  /**
   * 重置連擊
   */
  const resetCombo = useCallback(() => {
    const newState = manageStarRewardsUseCase.resetCombo(state)
    setState(newState)
  }, [manageStarRewardsUseCase, state])

  /**
   * 清除最近獲得的星星狀態（動畫完成後呼叫）
   */
  const clearLastEarned = useCallback(() => {
    setLastEarned(null)
  }, [])

  /**
   * 更新每日目標
   */
  const updateDailyGoal = useCallback(
    (newGoal: number) => {
      const newState = manageStarRewardsUseCase.updateDailyGoal(state, newGoal)
      setState(newState)
    },
    [manageStarRewardsUseCase, state]
  )

  /**
   * 從外部設定獎勵狀態（用於即時同步）
   * 直接取代本地狀態，不觸發儲存（因為資料來自雲端）
   */
  const setRewardsFromExternal = useCallback((rewards: StarRewardsState) => {
    setState(rewards)
  }, [])

  // 計算當日進度
  const dailyProgress = manageStarRewardsUseCase.getDailyProgress(state)

  return {
    state,
    todayStars: state.todayStars,
    totalStars: state.totalStars,
    dailyGoal: state.dailyGoal,
    currentCombo: state.currentCombo,
    dailyProgress,
    lastEarned,
    addStars,
    addDailyBonus,
    resetCombo,
    clearLastEarned,
    updateDailyGoal,
    setRewardsFromExternal,
  }
}
