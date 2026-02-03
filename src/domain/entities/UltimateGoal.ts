export interface UltimateGoal {
  id: string
  name: string // e.g., "出門"
  targetTime: string // HH:MM format (e.g., "07:50")
  enabled: boolean
  todoIds: string[] // Ordered list of todo IDs associated with this goal
  reminderIntervals: number[] // Minutes before deadline to remind (e.g., [30, 15, 5])
  createdAt: number
}

export interface GoalList {
  goals: UltimateGoal[]
}

export const DEFAULT_GOAL_LIST: GoalList = {
  goals: [],
}

export const DEFAULT_ULTIMATE_GOAL: UltimateGoal = {
  id: '',
  name: '',
  targetTime: '07:50',
  enabled: false,
  todoIds: [],
  reminderIntervals: [30, 15, 5],
  createdAt: 0,
}
