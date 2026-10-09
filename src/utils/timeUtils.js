import { useState, useEffect } from 'react'

/**
 * Format date/time specifically for Indian Standard Time (IST - Asia/Kolkata)
 */
export function getIndianStandardTime(date = new Date()) {
  const timeFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  const dateFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return {
    timeStr: timeFormatter.format(date),
    dateStr: dateFormatter.format(date),
    timeZone: 'IST',
    timeZoneOffset: 'UTC+5:30',
  }
}

/**
 * React Hook for live updating Indian Standard Time clock
 * Updates every second smoothly
 */
export function useIndianTime() {
  const [timeData, setTimeData] = useState(() => getIndianStandardTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeData(getIndianStandardTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return timeData
}
