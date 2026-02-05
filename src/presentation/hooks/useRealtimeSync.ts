import { useEffect, useCallback, useRef } from 'react'
import {
  realtimeSyncService,
  type RealtimeChangeEvent,
} from '@/infrastructure/supabase/RealtimeSyncService'
import type { Todo } from '@/domain/entities/Todo'
import type { StarRewardsState } from '@/domain/entities/StarRewards'
import type { UltimateGoal } from '@/domain/entities/UltimateGoal'

interface UseRealtimeSyncOptions {
  userId: string | null
  onTodosChange?: (todos: Todo[]) => void
  onStarRewardsChange?: (rewards: StarRewardsState) => void
  onGoalsChange?: (goals: UltimateGoal[]) => void
}

/**
 * useRealtimeSync Hook - 即時同步資料變更
 *
 * 當其他裝置修改資料時，自動更新本地狀態
 */
export function useRealtimeSync({
  userId,
  onTodosChange,
  onStarRewardsChange,
  onGoalsChange,
}: UseRealtimeSyncOptions): { connected: boolean } {
  // Use refs to avoid stale closures in callbacks
  const onTodosChangeRef = useRef(onTodosChange)
  const onStarRewardsChangeRef = useRef(onStarRewardsChange)
  const onGoalsChangeRef = useRef(onGoalsChange)

  // Keep refs in sync
  useEffect(() => {
    onTodosChangeRef.current = onTodosChange
  }, [onTodosChange])

  useEffect(() => {
    onStarRewardsChangeRef.current = onStarRewardsChange
  }, [onStarRewardsChange])

  useEffect(() => {
    onGoalsChangeRef.current = onGoalsChange
  }, [onGoalsChange])

  // Handle todos change
  const handleTodosChange = useCallback((event: RealtimeChangeEvent) => {
    if (event.eventType === 'DELETE') return

    const data = event.newData as { todos?: Todo[] } | null
    if (data?.todos && onTodosChangeRef.current) {
      console.log('Realtime: Todos updated from another device')
      onTodosChangeRef.current(data.todos)
    }
  }, [])

  // Handle star rewards change
  const handleStarRewardsChange = useCallback((event: RealtimeChangeEvent) => {
    if (event.eventType === 'DELETE') return

    const data = event.newData as { rewards?: StarRewardsState } | null
    if (data?.rewards && onStarRewardsChangeRef.current) {
      console.log('Realtime: Star rewards updated from another device')
      onStarRewardsChangeRef.current(data.rewards)
    }
  }, [])

  // Handle goals change
  const handleGoalsChange = useCallback((event: RealtimeChangeEvent) => {
    if (event.eventType === 'DELETE') return

    const data = event.newData as { goals?: UltimateGoal[] } | null
    if (data?.goals && onGoalsChangeRef.current) {
      console.log('Realtime: Goals updated from another device')
      onGoalsChangeRef.current(data.goals)
    }
  }, [])

  // Subscribe/unsubscribe based on userId
  useEffect(() => {
    if (!userId) {
      realtimeSyncService.unsubscribe()
      return
    }

    // Start listening
    realtimeSyncService.subscribe(userId)

    // Register callbacks
    const unsubTodos = realtimeSyncService.onDataChange('user_todos', handleTodosChange)
    const unsubStars = realtimeSyncService.onDataChange('user_star_rewards', handleStarRewardsChange)
    const unsubGoals = realtimeSyncService.onDataChange('user_ultimate_goals', handleGoalsChange)

    return () => {
      unsubTodos()
      unsubStars()
      unsubGoals()
    }
  }, [userId, handleTodosChange, handleStarRewardsChange, handleGoalsChange])

  return {
    connected: realtimeSyncService.connected,
  }
}
