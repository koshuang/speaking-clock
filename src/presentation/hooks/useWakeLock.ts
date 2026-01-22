import { useCallback, useEffect, useRef, useState } from 'react'
import { container } from '../../di/container'

export function useWakeLock() {
  const { wakeLockManager } = container

  const [isSupported, setIsSupported] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const wantActiveRef = useRef(false)

  useEffect(() => {
    setIsSupported(wakeLockManager.isSupported())
    setIsActive(wakeLockManager.isActive())
  }, [wakeLockManager])

  const request = useCallback(async () => {
    wantActiveRef.current = true
    const success = await wakeLockManager.request()
    setIsActive(success)
    return success
  }, [wakeLockManager])

  const release = useCallback(async () => {
    wantActiveRef.current = false
    await wakeLockManager.release()
    setIsActive(false)
  }, [wakeLockManager])

  // 當頁面重新可見時，重新請求 Wake Lock
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        if (wantActiveRef.current) {
          const success = await wakeLockManager.request()
          setIsActive(success)
        } else {
          setIsActive(wakeLockManager.isActive())
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [wakeLockManager])

  return { isSupported, isActive, request, release }
}
