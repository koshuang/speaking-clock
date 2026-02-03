import { Target, Clock } from 'lucide-react'
import type { UltimateGoal } from '@/domain/entities/UltimateGoal'

interface GoalStatusIndicatorProps {
  goal: UltimateGoal | null
  timeUntilDeadline: number // minutes (can be negative if overdue)
  isOverdue: boolean
  onClick?: () => void
  variant?: 'compact' | 'card'
}

/**
 * GoalStatusIndicator - 目標狀態指示器
 * 顯示終極目標的倒數時間與緊急程度
 * - compact: 用於 Header 的緊湊版本
 * - card: 用於首頁卡片的完整版本
 */
export function GoalStatusIndicator({
  goal,
  timeUntilDeadline,
  isOverdue,
  onClick,
  variant = 'compact',
}: GoalStatusIndicatorProps) {
  // Don't render if no goal or goal is disabled
  if (!goal || !goal.enabled) {
    return null
  }

  // Determine urgency color
  const getUrgencyClass = () => {
    if (isOverdue || timeUntilDeadline < 5) {
      return 'text-red-600 animate-pulse'
    }
    if (timeUntilDeadline < 15) {
      return 'text-orange-600'
    }
    if (timeUntilDeadline < 30) {
      return 'text-yellow-600'
    }
    return 'text-green-600'
  }

  // Get background color class for card variant
  const getUrgencyBgClass = () => {
    if (isOverdue || timeUntilDeadline < 5) {
      return 'bg-red-50 dark:bg-red-950/30'
    }
    if (timeUntilDeadline < 15) {
      return 'bg-orange-50 dark:bg-orange-950/30'
    }
    if (timeUntilDeadline < 30) {
      return 'bg-yellow-50 dark:bg-yellow-950/30'
    }
    return 'bg-green-50 dark:bg-green-950/30'
  }

  const urgencyClass = getUrgencyClass()

  // Card variant - full display for homepage
  if (variant === 'card') {
    return (
      <div
        onClick={onClick}
        className={`flex items-center justify-between rounded-lg p-2 ${getUrgencyBgClass()} ${onClick ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center rounded-full p-2 ${urgencyClass.replace('text-', 'bg-').replace('-600', '-100')} dark:bg-opacity-20`}>
            <Target className={`h-5 w-5 ${urgencyClass}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{goal.name}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {goal.targetTime}
              </span>
            </div>
            <div className={`text-sm font-semibold ${urgencyClass}`}>
              {isOverdue ? (
                <>超時 {Math.abs(timeUntilDeadline)} 分鐘</>
              ) : (
                <>還有 {timeUntilDeadline} 分鐘</>
              )}
            </div>
          </div>
        </div>
        <div className={`text-2xl font-bold tabular-nums ${urgencyClass}`}>
          {isOverdue ? `-${Math.abs(timeUntilDeadline)}` : timeUntilDeadline}
          <span className="text-sm font-normal ml-1">分</span>
        </div>
      </div>
    )
  }

  // Compact variant - for header
  const formatTimeDisplay = () => {
    if (isOverdue) {
      const minutesOverdue = Math.abs(timeUntilDeadline)
      return `超時 ${minutesOverdue}分`
    }

    return `${goal.name} (${timeUntilDeadline}分)`
  }

  const displayText = formatTimeDisplay()

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 ${urgencyClass} transition-colors hover:opacity-80`}
      title="點擊查看目標設定"
    >
      <Target className="h-4 w-4" />
      <span className="text-sm font-semibold tabular-nums">{displayText}</span>
    </button>
  )
}
