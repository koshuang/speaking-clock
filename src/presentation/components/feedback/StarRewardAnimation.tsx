import { useEffect, useState, useRef } from 'react'
import { Star } from 'lucide-react'

interface StarRewardAnimationProps {
  show: boolean
  stars: number
  hasComboBonus?: boolean
  onComplete?: () => void
}

/**
 * StarRewardAnimation - 星星獎勵動畫元件
 * 任務完成時顯示獲得星星的視覺效果
 */
export function StarRewardAnimation({
  show,
  stars,
  hasComboBonus = false,
  onComplete,
}: StarRewardAnimationProps) {
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'enter' | 'show' | 'exit'>('idle')
  const onCompleteRef = useRef(onComplete)

  // Keep ref updated with latest callback
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (show && stars > 0) {
      // Animation state initialization - intentional
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true)
      setPhase('enter')

      // 進入動畫
      const enterTimer = setTimeout(() => setPhase('show'), 100)

      // 顯示時間
      const showTimer = setTimeout(() => setPhase('exit'), 1500)

      // 退出動畫完成
      const exitTimer = setTimeout(() => {
        setVisible(false)
        setPhase('idle')
        onCompleteRef.current?.()
      }, 2000)

      return () => {
        clearTimeout(enterTimer)
        clearTimeout(showTimer)
        clearTimeout(exitTimer)
      }
    }
  }, [show, stars])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
          phase === 'show' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 星星獎勵內容 */}
      <div
        className={`relative flex flex-col items-center gap-2 transition-all duration-500 ${
          phase === 'enter'
            ? 'scale-50 opacity-0'
            : phase === 'show'
            ? 'scale-100 opacity-100'
            : 'scale-150 opacity-0 -translate-y-20'
        }`}
      >
        {/* 主星星 */}
        <div className="relative">
          <Star
            className="h-20 w-20 text-yellow-500 fill-yellow-500 drop-shadow-lg animate-star-spin"
          />
          {/* 光暈效果 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-yellow-400/30 blur-xl animate-pulse" />
          </div>
        </div>

        {/* 獲得星星數 */}
        <div className="flex items-center gap-2 bg-background/90 px-4 py-2 rounded-full shadow-lg">
          <span className="text-2xl font-bold text-yellow-600">+{stars}</span>
          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
        </div>

        {/* Combo 獎勵提示 */}
        {hasComboBonus && (
          <div className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full animate-bounce">
            Combo Bonus! +2
          </div>
        )}

        {/* 散落的小星星 */}
        <div className="absolute inset-0 overflow-visible">
          {[...Array(6)].map((_, i) => (
            <Star
              key={i}
              className={`absolute h-4 w-4 text-yellow-400 fill-yellow-400 animate-star-scatter-${i + 1}`}
              style={{
                left: '50%',
                top: '50%',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
