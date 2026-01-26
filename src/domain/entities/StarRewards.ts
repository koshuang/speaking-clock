/**
 * Star Rewards - 星星獎勵狀態實體
 */

export interface DailyStarRecord {
  date: string              // YYYY-MM-DD
  earned: number            // 當日獲得星星數
  completedTasks: number    // 完成任務數
  totalTasks: number        // 總任務數
  onTimeCompletions: number // 準時完成數
  comboCount: number        // 連續完成數
}

export interface StarRewardsState {
  totalStars: number        // 累積總星星
  todayStars: number        // 今日星星
  dailyGoal: number         // 每日目標（預設 10）
  currentCombo: number      // 當前連擊數
  history: DailyStarRecord[] // 歷史紀錄（最近 7 天）
  lastUpdated: string       // 最後更新日期 YYYY-MM-DD
}

export const DEFAULT_STAR_REWARDS: StarRewardsState = {
  totalStars: 0,
  todayStars: 0,
  dailyGoal: 10,
  currentCombo: 0,
  history: [],
  lastUpdated: '',
}
