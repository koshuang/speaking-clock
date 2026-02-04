import { useCallback, useState } from 'react'
import type { Todo } from '@/domain/entities/Todo'
import { container } from '@/di/container'

export interface UseTaskCompletionReturn {
  showCelebration: boolean
  showStarReward: boolean
  completeTask: (todoId: string, isTimedTask: boolean) => void
  toggleTaskCompletion: (todoId: string) => void
  clearCelebration: () => void
  clearStarReward: () => void
}

interface UseTaskCompletionOptions {
  todos: Todo[]
  activeTodoId: string | null
  remainingSeconds: number
  childMode: boolean
  selectedVoiceId: string | null
  onToggleTodo: (id: string) => void
  onClearActiveTask: () => void
  // Star reward functions from useStarRewards
  onAddStars: (isOnTime: boolean) => { starsEarned: number; hasComboBonus: boolean }
  onAddDailyBonus: () => void
}

/**
 * useTaskCompletion Hook - 任務完成狀態管理
 *
 * 遵循 Clean Architecture 原則，使用 Domain 層的 TaskCompletionUseCase
 * 處理任務完成的業務邏輯，Presentation 層只負責狀態管理和 UI 回饋
 */
export function useTaskCompletion({
  todos,
  activeTodoId,
  remainingSeconds,
  childMode,
  selectedVoiceId,
  onToggleTodo,
  onClearActiveTask,
  onAddStars,
  onAddDailyBonus,
}: UseTaskCompletionOptions): UseTaskCompletionReturn {
  const {
    taskCompletionUseCase,
    completionFeedbackUseCase,
    childModeSettingsUseCase,
    speechSynthesizer,
    soundEffectPlayer,
  } = container

  const [showCelebration, setShowCelebration] = useState(false)
  const [showStarReward, setShowStarReward] = useState(false)

  /**
   * 完成任務（核心邏輯）
   * - 使用 Domain 層 UseCase 判斷業務規則
   * - 處理星星獎勵
   * - 觸發 UI 回饋
   */
  const completeTask = useCallback(
    (todoId: string, isTimedTask: boolean) => {
      const todo = todos.find((t) => t.id === todoId)

      // 使用 Domain UseCase 檢查是否可以完成
      if (!taskCompletionUseCase.canComplete(todo)) return

      // 標記任務為已完成
      onToggleTodo(todoId)

      // 使用 Domain UseCase 判斷是否準時完成
      const isOnTime = taskCompletionUseCase.isCompletedOnTime(isTimedTask, remainingSeconds)

      // 增加星星獎勵 (使用外部傳入的 useStarRewards 函數)
      onAddStars(isOnTime)
      setShowStarReward(true)

      // 使用 Domain UseCase 檢查是否完成所有任務
      if (taskCompletionUseCase.willCompleteAllTasks({ items: todos }, todoId)) {
        onAddDailyBonus()
      }

      // 兒童模式慶祝動畫
      if (childMode) {
        setShowCelebration(true)
        soundEffectPlayer.playCompletionSound()
        const phrase = completionFeedbackUseCase.getRandomCompletionPhrase()
        const rate = childModeSettingsUseCase.getChildModeSpeechRate()
        speechSynthesizer.speak(phrase, selectedVoiceId ?? undefined, undefined, rate)
      }

      // 如果是進行中的計時任務，清除計時器狀態
      if (activeTodoId === todoId) {
        onClearActiveTask()
      }
    },
    [
      todos,
      activeTodoId,
      remainingSeconds,
      childMode,
      selectedVoiceId,
      taskCompletionUseCase,
      completionFeedbackUseCase,
      childModeSettingsUseCase,
      speechSynthesizer,
      soundEffectPlayer,
      onToggleTodo,
      onClearActiveTask,
      onAddStars,
      onAddDailyBonus,
    ]
  )

  /**
   * 切換任務完成狀態
   * - 完成時：走完整的 completeTask 流程（加星星）
   * - 取消完成時：只切換狀態（不扣星星）
   */
  const toggleTaskCompletion = useCallback(
    (todoId: string) => {
      const todo = todos.find((t) => t.id === todoId)
      if (!todo) return

      if (taskCompletionUseCase.canUncomplete(todo)) {
        // 取消完成 - 只切換狀態，不影響星星
        onToggleTodo(todoId)
      } else if (taskCompletionUseCase.canComplete(todo)) {
        // 完成 - 使用完整流程
        const isTimedTask = taskCompletionUseCase.isActiveTimedTask(todo, activeTodoId)
        completeTask(todoId, isTimedTask)
      }
    },
    [todos, activeTodoId, taskCompletionUseCase, onToggleTodo, completeTask]
  )

  const clearCelebration = useCallback(() => {
    setShowCelebration(false)
  }, [])

  const clearStarReward = useCallback(() => {
    setShowStarReward(false)
  }, [])

  return {
    showCelebration,
    showStarReward,
    completeTask,
    toggleTaskCompletion,
    clearCelebration,
    clearStarReward,
  }
}
