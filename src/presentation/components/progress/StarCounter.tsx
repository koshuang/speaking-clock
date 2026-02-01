import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

interface StarCounterProps {
  count: number
  animate?: boolean
}

/**
 * StarCounter - 星星計數器元件
 * 顯示在 Header 右側，顯示累積的星星數
 */
export function StarCounter({ count, animate = false }: StarCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (animate) {
      // Trigger animation on prop change - intentional
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [animate, count])

  return (
    <div className="flex items-center gap-1">
      <Star
        className={`h-4 w-4 text-yellow-500 fill-yellow-500 ${isAnimating ? 'animate-star-pop' : ''}`}
      />
      <span
        className={`text-sm font-semibold tabular-nums ${isAnimating ? 'animate-number-pop' : ''}`}
      >
        {count}
      </span>
    </div>
  )
}
