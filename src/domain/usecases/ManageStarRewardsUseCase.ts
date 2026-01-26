import type { StarRewardsState, DailyStarRecord } from '../entities/StarRewards'
import { STAR_REWARD_RULES } from '../entities/StarRewardRules'
import type { StarRewardsRepository } from '../ports/StarRewardsRepository'

/**
 * Manage Star Rewards Use Case - 星星獎勵管理邏輯
 */
export class ManageStarRewardsUseCase {
  private readonly starRewardsRepository: StarRewardsRepository

  constructor(starRewardsRepository: StarRewardsRepository) {
    this.starRewardsRepository = starRewardsRepository
  }

  /**
   * 載入星星獎勵狀態
   */
  load(): StarRewardsState {
    const state = this.starRewardsRepository.load()
    return this.checkDailyReset(state)
  }

  /**
   * 取得今天的日期字串 YYYY-MM-DD
   */
  private getTodayString(): string {
    const now = new Date()
    return now.toISOString().split('T')[0]
  }

  /**
   * 檢查日期重置（跨日時重置今日星星）
   */
  checkDailyReset(state: StarRewardsState): StarRewardsState {
    const today = this.getTodayString()

    if (state.lastUpdated !== today) {
      // 儲存昨日紀錄到歷史
      const updatedHistory = this.updateHistory(state.history, state)

      const newState: StarRewardsState = {
        ...state,
        todayStars: 0,
        currentCombo: 0,
        history: updatedHistory,
        lastUpdated: today,
      }

      this.starRewardsRepository.save(newState)
      return newState
    }

    return state
  }

  /**
   * 更新歷史紀錄
   */
  private updateHistory(
    history: DailyStarRecord[],
    previousState: StarRewardsState
  ): DailyStarRecord[] {
    // 如果前一天有資料，加入歷史
    if (previousState.lastUpdated && previousState.todayStars > 0) {
      const newRecord: DailyStarRecord = {
        date: previousState.lastUpdated,
        earned: previousState.todayStars,
        completedTasks: 0, // 這些值需要從外部傳入
        totalTasks: 0,
        onTimeCompletions: 0,
        comboCount: previousState.currentCombo,
      }

      const updatedHistory = [newRecord, ...history]
      // 保留最近 7 天
      return updatedHistory.slice(0, STAR_REWARD_RULES.HISTORY_DAYS)
    }

    return history
  }

  /**
   * 任務完成時增加星星
   * @param state - 當前狀態
   * @param isOnTime - 是否準時完成
   * @returns 新狀態和獲得的星星數
   */
  addStarsForCompletion(
    state: StarRewardsState,
    isOnTime: boolean
  ): { state: StarRewardsState; starsEarned: number; hasComboBonus: boolean } {
    let starsEarned = STAR_REWARD_RULES.TASK_COMPLETE

    // 準時完成加分
    if (isOnTime) {
      starsEarned += STAR_REWARD_RULES.ON_TIME_BONUS
    }

    // 更新連擊數
    const newCombo = state.currentCombo + 1

    // 檢查連擊獎勵（每 3 個連擊額外加分）
    const hasComboBonus = newCombo % STAR_REWARD_RULES.COMBO_THRESHOLD === 0
    if (hasComboBonus) {
      starsEarned += STAR_REWARD_RULES.COMBO_3_BONUS
    }

    const newState: StarRewardsState = {
      ...state,
      totalStars: state.totalStars + starsEarned,
      todayStars: state.todayStars + starsEarned,
      currentCombo: newCombo,
      lastUpdated: this.getTodayString(),
    }

    this.starRewardsRepository.save(newState)

    return { state: newState, starsEarned, hasComboBonus }
  }

  /**
   * 每日任務全部完成時的額外獎勵
   */
  addDailyCompletionBonus(state: StarRewardsState): { state: StarRewardsState; starsEarned: number } {
    const starsEarned = STAR_REWARD_RULES.DAILY_COMPLETE_BONUS

    const newState: StarRewardsState = {
      ...state,
      totalStars: state.totalStars + starsEarned,
      todayStars: state.todayStars + starsEarned,
      lastUpdated: this.getTodayString(),
    }

    this.starRewardsRepository.save(newState)

    return { state: newState, starsEarned }
  }

  /**
   * 重置連擊（任務失敗或過期時）
   */
  resetCombo(state: StarRewardsState): StarRewardsState {
    const newState: StarRewardsState = {
      ...state,
      currentCombo: 0,
    }

    this.starRewardsRepository.save(newState)
    return newState
  }

  /**
   * 取得當日進度百分比
   */
  getDailyProgress(state: StarRewardsState): number {
    if (state.dailyGoal <= 0) return 100
    return Math.min(100, Math.round((state.todayStars / state.dailyGoal) * 100))
  }

  /**
   * 取得今日紀錄
   */
  getTodayRecord(state: StarRewardsState): DailyStarRecord {
    return {
      date: this.getTodayString(),
      earned: state.todayStars,
      completedTasks: 0,
      totalTasks: 0,
      onTimeCompletions: 0,
      comboCount: state.currentCombo,
    }
  }

  /**
   * 更新每日目標
   */
  updateDailyGoal(state: StarRewardsState, newGoal: number): StarRewardsState {
    const newState: StarRewardsState = {
      ...state,
      dailyGoal: Math.max(1, newGoal),
    }

    this.starRewardsRepository.save(newState)
    return newState
  }
}
