import { useEffect, useState } from 'react'

function useSaveDelay(setNotificationStatus: (isShowing: boolean) => void, delay: number) {
  const [updateTimer, setUpdateTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [notificationTimer, setNotificationTimer] = useState<NodeJS.Timeout | undefined>(undefined)

  const restartTimer = (onSave: () => void) => {
    clearTimeout(updateTimer)
    setUpdateTimer(setTimeout(() => {
      onSave()
      setNotificationStatus(true)
      // Show Saved Notification for fade animation duration
      clearTimeout(notificationTimer)
      setNotificationTimer(setTimeout(() => {
        setNotificationStatus(false)
        clearTimeout(notificationTimer)
      }, delay))
      clearTimeout(updateTimer)
    }, delay))
  }

  const clearUpdateTimer = (hasSaved = true) => {
    clearTimeout(updateTimer)
    if (hasSaved) {
      setNotificationStatus(true)
      clearTimeout(notificationTimer)
      setNotificationTimer(setTimeout(() => {
        setNotificationStatus(false)
        clearTimeout(notificationTimer)
      }, delay))
    } else {
      setNotificationStatus(false)
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(updateTimer)
      clearTimeout(notificationTimer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { restartTimer, clearUpdateTimer }
}

export default useSaveDelay
