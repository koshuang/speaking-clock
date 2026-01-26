/**
 * Star Reward Rules - 星星獎勵規則常數
 */

export const STAR_REWARD_RULES = {
  /** 完成任務獲得 1 星 */
  TASK_COMPLETE: 1,
  /** 準時完成額外獲得 1 星 */
  ON_TIME_BONUS: 1,
  /** 連續完成 3 個任務額外獲得 2 星 */
  COMBO_3_BONUS: 2,
  /** 每日任務全部完成額外獲得 3 星 */
  DAILY_COMPLETE_BONUS: 3,
  /** 觸發 combo bonus 的門檻 */
  COMBO_THRESHOLD: 3,
  /** 歷史紀錄保留天數 */
  HISTORY_DAYS: 7,
} as const

export type StarRewardRuleKey = keyof typeof STAR_REWARD_RULES
