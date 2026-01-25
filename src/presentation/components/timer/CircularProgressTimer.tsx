interface CircularProgressTimerProps {
  remainingSeconds: number
  totalSeconds: number
  size?: number
  strokeWidth?: number
}

export function CircularProgressTimer({
  remainingSeconds,
  totalSeconds,
  size = 120,
  strokeWidth = 8,
}: CircularProgressTimerProps) {
  const progress = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Color based on progress
  const getColor = () => {
    if (progress > 50) return '#22c55e' // green
    if (progress > 25) return '#eab308' // yellow
    return '#ef4444' // red
  }

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300"
        />
      </svg>
      {/* Center time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold tabular-nums" style={{ color: getColor() }}>
          {formatTime(remainingSeconds)}
        </span>
      </div>
    </div>
  )
}
