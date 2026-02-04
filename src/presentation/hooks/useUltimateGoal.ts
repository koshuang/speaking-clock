import { useCallback, useEffect, useRef, useState } from 'react'
import type { UltimateGoal, GoalList } from '../../domain/entities/UltimateGoal'
import { DEFAULT_ULTIMATE_GOAL } from '../../domain/entities/UltimateGoal'
import type { TodoList } from '../../domain/entities/Todo'
import { container } from '../../di/container'

export function useUltimateGoal(todoList: TodoList) {
  const { ultimateGoalUseCase } = container

  const [goalList, setGoalList] = useState<GoalList>(() => ultimateGoalUseCase.load())
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const timeUpdateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [, forceUpdate] = useState({}) // For triggering re-renders on time updates

  // Get currently selected goal or the next upcoming one
  const selectedGoal = selectedGoalId
    ? ultimateGoalUseCase.getGoalById(goalList, selectedGoalId)
    : null

  const nextUpcomingGoal = ultimateGoalUseCase.getNextUpcomingGoal(goalList)
  const activeGoal = selectedGoal || nextUpcomingGoal

  // Update time every second when there are enabled goals
  useEffect(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
      timeUpdateIntervalRef.current = null
    }

    const enabledGoals = ultimateGoalUseCase.getEnabledGoals(goalList)
    if (enabledGoals.length === 0) return

    timeUpdateIntervalRef.current = setInterval(() => {
      forceUpdate({}) // Trigger re-render to update time displays
    }, 1000)

    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
        timeUpdateIntervalRef.current = null
      }
    }
  }, [goalList, ultimateGoalUseCase])

  const addGoal = useCallback(
    (name: string, targetTime: string, todoIds: string[] = []) => {
      const newGoal: UltimateGoal = {
        ...DEFAULT_ULTIMATE_GOAL,
        id: crypto.randomUUID(),
        name,
        targetTime,
        todoIds,
        enabled: true,
        createdAt: Date.now(),
      }
      const updated = ultimateGoalUseCase.addGoal(goalList, newGoal)
      setGoalList(updated)
      setSelectedGoalId(newGoal.id)
      return newGoal
    },
    [goalList, ultimateGoalUseCase]
  )

  const updateGoal = useCallback(
    (goalId: string, updates: Partial<UltimateGoal>) => {
      const updated = ultimateGoalUseCase.updateGoal(goalList, goalId, updates)
      setGoalList(updated)
    },
    [goalList, ultimateGoalUseCase]
  )

  const removeGoal = useCallback(
    (goalId: string) => {
      const updated = ultimateGoalUseCase.removeGoal(goalList, goalId)
      setGoalList(updated)
      if (selectedGoalId === goalId) {
        setSelectedGoalId(null)
      }
    },
    [goalList, selectedGoalId, ultimateGoalUseCase]
  )

  const toggleGoalEnabled = useCallback(
    (goalId: string) => {
      const goal = ultimateGoalUseCase.getGoalById(goalList, goalId)
      if (!goal) return
      updateGoal(goalId, { enabled: !goal.enabled })
    },
    [goalList, ultimateGoalUseCase, updateGoal]
  )

  const addTodoToGoal = useCallback(
    (goalId: string, todoId: string) => {
      const goal = ultimateGoalUseCase.getGoalById(goalList, goalId)
      if (!goal || goal.todoIds.includes(todoId)) return
      updateGoal(goalId, { todoIds: [...goal.todoIds, todoId] })
    },
    [goalList, ultimateGoalUseCase, updateGoal]
  )

  const removeTodoFromGoal = useCallback(
    (goalId: string, todoId: string) => {
      const goal = ultimateGoalUseCase.getGoalById(goalList, goalId)
      if (!goal) return
      updateGoal(goalId, { todoIds: goal.todoIds.filter(id => id !== todoId) })
    },
    [goalList, ultimateGoalUseCase, updateGoal]
  )

  // Computed values for active goal
  const timeUntilDeadline = activeGoal ? ultimateGoalUseCase.getTimeUntilDeadline(activeGoal) : 0
  const startTime = activeGoal ? ultimateGoalUseCase.calculateStartTime(activeGoal, todoList.items) : null
  const totalDuration = activeGoal ? ultimateGoalUseCase.getTotalDurationMinutes(activeGoal, todoList.items) : 0
  const remainingTodos = activeGoal ? ultimateGoalUseCase.getRemainingTodos(activeGoal, todoList) : []
  const progress = activeGoal ? ultimateGoalUseCase.getCompletedCount(activeGoal, todoList) : { completed: 0, total: 0 }
  const isOverdue = activeGoal ? ultimateGoalUseCase.isOverdue(activeGoal) : false

  return {
    // List operations
    goals: goalList.goals,
    selectedGoalId,
    setSelectedGoalId,
    addGoal,
    updateGoal,
    removeGoal,
    toggleGoalEnabled,
    addTodoToGoal,
    removeTodoFromGoal,

    // Active goal (selected or next upcoming)
    activeGoal,
    timeUntilDeadline,
    startTime,
    totalDuration,
    remainingTodos,
    progress,
    isOverdue,
  }
}
