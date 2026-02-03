import type { UltimateGoal, GoalList } from '../entities/UltimateGoal'
import type { Todo, TodoList } from '../entities/Todo'
import type { UltimateGoalRepository } from '../ports/UltimateGoalRepository'

export class UltimateGoalUseCase {
  private readonly repository: UltimateGoalRepository

  constructor(repository: UltimateGoalRepository) {
    this.repository = repository
  }

  load(): GoalList {
    return this.repository.load()
  }

  save(goalList: GoalList): void {
    this.repository.save(goalList)
  }

  addGoal(goalList: GoalList, goal: UltimateGoal): GoalList {
    const updated = { goals: [...goalList.goals, goal] }
    this.save(updated)
    return updated
  }

  updateGoal(goalList: GoalList, goalId: string, updates: Partial<UltimateGoal>): GoalList {
    const updated = {
      goals: goalList.goals.map(g => g.id === goalId ? { ...g, ...updates } : g)
    }
    this.save(updated)
    return updated
  }

  removeGoal(goalList: GoalList, goalId: string): GoalList {
    const updated = { goals: goalList.goals.filter(g => g.id !== goalId) }
    this.save(updated)
    return updated
  }

  getGoalById(goalList: GoalList, goalId: string): UltimateGoal | undefined {
    return goalList.goals.find(g => g.id === goalId)
  }

  getEnabledGoals(goalList: GoalList): UltimateGoal[] {
    return goalList.goals.filter(g => g.enabled)
  }

  getNextUpcomingGoal(goalList: GoalList, currentTime: Date = new Date()): UltimateGoal | null {
    const enabledGoals = this.getEnabledGoals(goalList)
    if (enabledGoals.length === 0) return null

    // Sort by time until deadline (closest first)
    const sortedGoals = enabledGoals
      .map(goal => ({ goal, timeLeft: this.getTimeUntilDeadline(goal, currentTime) }))
      .filter(({ timeLeft }) => timeLeft > -60) // Include goals up to 60 min overdue
      .sort((a, b) => a.timeLeft - b.timeLeft)

    return sortedGoals[0]?.goal || null
  }

  /**
   * Calculate recommended start time based on goal deadline and total todo durations
   * @param goal - The ultimate goal with target time
   * @param todos - List of todos (uses their durationMinutes)
   * @returns Date representing when to start
   */
  calculateStartTime(goal: UltimateGoal, todos: Todo[]): Date {
    const totalMinutes = this.getTotalDurationMinutes(goal, todos)
    const targetDate = this.getTargetDateTime(goal.targetTime)

    return new Date(targetDate.getTime() - totalMinutes * 60 * 1000)
  }

  /**
   * Get total duration in minutes for all todos linked to this goal
   */
  getTotalDurationMinutes(goal: UltimateGoal, todos: Todo[]): number {
    const goalTodos = todos.filter(t => goal.todoIds.includes(t.id))
    return goalTodos.reduce((sum, todo) => sum + (todo.durationMinutes || 0), 0)
  }

  /**
   * Get time remaining until deadline in minutes (can be negative if overdue)
   */
  getTimeUntilDeadline(goal: UltimateGoal, currentTime: Date = new Date()): number {
    const targetDate = this.getTargetDateTime(goal.targetTime, currentTime)
    const diffMs = targetDate.getTime() - currentTime.getTime()
    return Math.floor(diffMs / (60 * 1000))
  }

  /**
   * Check if a reminder should be triggered based on current time
   * Returns { shouldRemind: true, minutesLeft: X } if within a reminder interval
   */
  shouldRemind(goal: UltimateGoal, currentTime: Date = new Date()): { shouldRemind: boolean; minutesLeft: number } {
    const minutesLeft = this.getTimeUntilDeadline(goal, currentTime)

    // Check if we're at any reminder interval (within 30 seconds window)
    const isAtReminderPoint = goal.reminderIntervals.some(interval =>
      Math.abs(minutesLeft - interval) < 0.5
    )

    return {
      shouldRemind: isAtReminderPoint && minutesLeft > 0,
      minutesLeft: Math.max(0, minutesLeft)
    }
  }

  /**
   * Get remaining (uncompleted) todos for this goal
   */
  getRemainingTodos(goal: UltimateGoal, todoList: TodoList): Todo[] {
    return todoList.items
      .filter(t => goal.todoIds.includes(t.id) && !t.completed)
      .sort((a, b) => a.order - b.order)
  }

  /**
   * Get completed todos count for progress tracking
   */
  getCompletedCount(goal: UltimateGoal, todoList: TodoList): { completed: number; total: number } {
    const goalTodos = todoList.items.filter(t => goal.todoIds.includes(t.id))
    const completed = goalTodos.filter(t => t.completed).length
    return { completed, total: goalTodos.length }
  }

  /**
   * Check if the goal deadline is overdue
   */
  isOverdue(goal: UltimateGoal, currentTime: Date = new Date()): boolean {
    return this.getTimeUntilDeadline(goal, currentTime) < 0
  }

  /**
   * Convert HH:MM target time to Date object for today
   * If the time has passed, assumes tomorrow
   */
  private getTargetDateTime(targetTime: string, referenceDate: Date = new Date()): Date {
    const [hours, minutes] = targetTime.split(':').map(Number)
    const target = new Date(referenceDate)
    target.setHours(hours, minutes, 0, 0)

    // If target time already passed today, it might be for tomorrow
    // But for immediate use, we'll just use today's date
    return target
  }
}
