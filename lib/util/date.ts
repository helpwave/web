import { equalSizeGroups } from './array'

export const monthsList = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'] as const
export type Month = typeof monthsList[number]

export const weekDayList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
export type WeekDay = typeof weekDayList[number]

export const formatDate = (date: Date) => {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = (date.getDate()).toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatDateTime = (date: Date) => {
  const dateString = formatDate(date)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${dateString}T${hours}:${minutes}`
}

export const getDaysInMonth = (year: number, month: number): number => {
  const lastDayOfMonth = new Date(year, month + 1, 0)
  return lastDayOfMonth.getDate()
}

export type Duration = {
  years?: number,
  months?: number,
  days?: number,
  hours?: number,
  minutes?: number,
  seconds?: number,
  milliseconds?: number,
}

export const changeDuration = (date: Date, duration: Duration, isAdding?: boolean): Date => {
  const {
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  } = duration

  // Check ranges
  if (years < 0) {
    console.error(`Range error years must be greater than 0: received ${years}`)
    return new Date(date)
  }
  if (months < 0 || months > 11) {
    console.error(`Range error month must be 0 <= month <= 11: received ${months}`)
    return new Date(date)
  }
  if (days < 0) {
    console.error(`Range error days must be greater than 0: received ${days}`)
    return new Date(date)
  }
  if (hours < 0 || hours > 23) {
    console.error(`Range error hours must be 0 <= hours <= 23: received ${hours}`)
    return new Date(date)
  }
  if (minutes < 0 || minutes > 59) {
    console.error(`Range error minutes must be 0 <= minutes <= 59: received ${minutes}`)
    return new Date(date)
  }
  if (seconds < 0 || seconds > 59) {
    console.error(`Range error seconds must be 0 <= seconds <= 59: received ${seconds}`)
    return new Date(date)
  }
  if (milliseconds < 0) {
    console.error(`Range error seconds must be greater than 0: received ${milliseconds}`)
    return new Date(date)
  }

  const multiplier = isAdding ? 1 : -1

  const newDate = new Date(date)

  newDate.setFullYear(newDate.getFullYear() + multiplier * years)

  newDate.setMonth(newDate.getMonth() + multiplier * months)

  newDate.setDate(newDate.getDate() + multiplier * days)

  newDate.setHours(newDate.getHours() + multiplier * hours)

  newDate.setMinutes(newDate.getMinutes() + multiplier * minutes)

  newDate.setSeconds(newDate.getSeconds() + multiplier * seconds)

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

/** Checks if a given date is in the range of two dates
 *
 * An undefined value for startDate or endDate means no bound for the start or end respectively
 */
export const isInTimeSpan = (value: Date, startDate?: Date, endDate?: Date): boolean => {
  if(startDate && endDate) {
    console.assert(startDate <= endDate)
    return startDate <= value && value <= endDate
  } else if (startDate) {
    return startDate <= value
  } else if(endDate) {
    return endDate >= value
  } else {
    return true
  }
}

/** Compare two dates on the year, month, day */
export const equalDate = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
}

export const getWeeksForCalenderMonth = (date: Date, weekStart: WeekDay, weeks: number = 6) => {
  const month = date.getMonth()
  const year = date.getFullYear()

  const dayList: Date[] = []
  let currentDate = new Date(year, month, 1) // Start of month
  const weekStartIndex = weekDayList.indexOf(weekStart)

  // Move the current day to the week before
  while (currentDate.getDay() !== weekStartIndex) {
    currentDate = subtractDuration(currentDate, { days: 1 })
  }

  while (dayList.length < 7 * weeks) {
    const date = new Date(currentDate)
    date.setHours(date.getHours(), date.getMinutes()) // To make sure we are not overwriting the time
    dayList.push(date)
    currentDate = addDuration(currentDate, { days: 1 })
  }

  // weeks
  return equalSizeGroups(dayList, 7)
}
