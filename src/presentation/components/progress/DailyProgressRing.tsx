import { Star } from 'lucide-react'

interface DailyProgressRingProps {
  completedTasks: number
  totalTasks: number
  todayStars: number
  dailyGoal: number
}

/**
 * DailyProgressRing - 每日進度環元件
 * 顯示當日任務完成度和星星進度
 */
export function DailyProgressRing({
  completedTasks,
  totalTasks,
  todayStars,
  dailyGoal,
}: DailyProgressRingProps) {
  // 計算進度百分比
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const starProgress = dailyGoal > 0 ? Math.min(100, Math.round((todayStars / dailyGoal) * 100)) : 0

  // SVG 參數
  const size = 120
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (taskProgress / 100) * circumference

  // 獲得鼓勵文字
  const getEncouragementText = () => {
    if (taskProgress === 100) return '太棒了！全部完成！'
    if (taskProgress >= 75) return '加油！快完成了！'
    if (taskProgress >= 50) return '做得好！繼續努力！'
    if (taskProgress >= 25) return '不錯的開始！'
    return '開始今天的任務吧！'
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm font-medium text-muted-foreground">今天的進度</div>

      {/* 進度環 */}
      <div className="relative">
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* 背景環 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* 進度環 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-primary transition-all duration-500 ease-out"
          />
        </svg>

        {/* 中央內容 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{taskProgress}%</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span>
              {todayStars}/{dailyGoal}
            </span>
          </div>
        </div>
      </div>

      {/* 任務統計 */}
      <div className="text-xs text-muted-foreground">
        {completedTasks}/{totalTasks} 個任務
      </div>

      {/* 鼓勵文字 */}
      <div className="text-sm font-medium text-primary">{getEncouragementText()}</div>

      {/* 星星進度條 */}
      <div className="w-full max-w-[200px]">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>今日星星</span>
          <span>{starProgress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted/30">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out"
            style={{ width: `${starProgress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
