export const formatDate = (date: Date) => {
  return `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function getDaysInMonth(year: number, month: number): number {
  const lastDayOfMonth = new Date(year, month + 1, 0)
  return lastDayOfMonth.getDate()
}

export type Duration = {
  years?: number,
  months?: number,
  days?: number,
  hours?: number,
  seconds?: number,
  milliseconds?: number
}

export const changeDuration = (date: Date, duration: Duration, isAdding?: boolean): Date => {
  const {
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    seconds = 0,
    milliseconds = 0,
  } = duration

  const multiplier = isAdding ? 1 : -1

  const newDate = new Date(date)

  // Add or subtract years and months
  newDate.setFullYear(newDate.getFullYear() + multiplier * years)
  newDate.setMonth(newDate.getMonth() + multiplier * months)

  // Handle month overflow
  while (newDate.getMonth() !== (date.getMonth() + multiplier * months) % 12) {
    newDate.setDate(newDate.getDate() - 1)
  }

  // Add or subtract days
  newDate.setDate(newDate.getDate() + multiplier * days)

  // Add or subtract hours
  newDate.setHours(newDate.getHours() + multiplier * hours)

  // Add or subtract seconds
  newDate.setSeconds(newDate.getSeconds() + multiplier * seconds)

  // Add or subtract milliseconds
  newDate.setMilliseconds(newDate.getMilliseconds() + multiplier * milliseconds)

  return newDate
}

export const addDuration = (date: Date, duration: Duration): Date => {
  return changeDuration(date, duration, true)
}

export const subtractDuration = (date: Date, duration: Duration): Date => {
  return changeDuration(date, duration, false)
}

export const getBetweenDuration = (startDate: Date, endDate: Date): Duration => {
  const durationInMilliseconds = endDate.getTime() - startDate.getTime()

  const millisecondsInSecond = 1000
  const millisecondsInMinute = 60 * millisecondsInSecond
  const millisecondsInHour = 60 * millisecondsInMinute
  const millisecondsInDay = 24 * millisecondsInHour
  const millisecondsInMonth = 30 * millisecondsInDay // Rough estimation, can be adjusted

  const years = Math.floor(durationInMilliseconds / (365.25 * millisecondsInDay))
  const months = Math.floor(durationInMilliseconds / millisecondsInMonth)
  const days = Math.floor(durationInMilliseconds / millisecondsInDay)
  const hours = Math.floor((durationInMilliseconds % millisecondsInDay) / millisecondsInHour)
  const seconds = Math.floor((durationInMilliseconds % millisecondsInHour) / millisecondsInSecond)
  const milliseconds = durationInMilliseconds % millisecondsInSecond

  return {
    years,
    months,
    days,
    hours,
    seconds,
    milliseconds,
  }
}
