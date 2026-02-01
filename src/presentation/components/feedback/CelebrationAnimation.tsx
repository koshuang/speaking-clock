import { useEffect, useMemo } from 'react'

interface CelebrationAnimationProps {
  show: boolean
  onComplete?: () => void
}

const CONFETTI_COLORS = [
  '#FF6B6B', // red
  '#FFE66D', // yellow
  '#4ECDC4', // teal
  '#45B7D1', // blue
  '#96CEB4', // green
  '#FFEAA7', // light yellow
  '#DDA0DD', // plum
  '#FF69B4', // hot pink
]

export function CelebrationAnimation({ show, onComplete }: CelebrationAnimationProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  // Generate 20 confetti particles - memoized to avoid regenerating on every render
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100, // random horizontal position %
        delay: Math.random() * 0.5, // random delay 0-0.5s
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 8 + Math.random() * 8, // 8-16px
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show] // Regenerate particles when show changes to true
  )

  if (!show) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: '50%',
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
