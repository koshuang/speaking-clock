import { useCallback, useEffect, useState } from 'react'
import { container } from '../../di/container'

export function useWakeLock() {
  const { wakeLockManager } = container

  const [isSupported, setIsSupported] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsSupported(wakeLockManager.isSupported())
    setIsActive(wakeLockManager.isActive())
  }, [wakeLockManager])

  const request = useCallback(async () => {
    const success = await wakeLockManager.request()
    setIsActive(success)
    return success
  }, [wakeLockManager])

  const release = useCallback(async () => {
    await wakeLockManager.release()
    setIsActive(false)
  }, [wakeLockManager])

  // 當頁面重新可見時，重新請求 Wake Lock
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isActive) {
        await wakeLockManager.request()
        setIsActive(wakeLockManager.isActive())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isActive, wakeLockManager])

  return { isSupported, isActive, request, release }
}
