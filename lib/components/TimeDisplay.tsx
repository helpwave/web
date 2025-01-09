import type { Languages } from '../hooks/useLanguage'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'

type TimeDisplayTranslation = {
  today: string,
  yesterday: string,
  tomorrow: string,
  inDays: (days: number) => string,
  agoDays: (days: number) => string,
  january: string,
  february: string,
  march: string,
  april: string,
  may: string,
  june: string,
  july: string,
  august: string,
  september: string,
  october: string,
  november: string,
  december: string,
}

const defaultTimeDisplayTranslations: Record<Languages, TimeDisplayTranslation> = {
  en: {
    today: 'today',
    yesterday: 'yesterday',
    tomorrow: 'tomorrow',
    inDays: (days: number) => `in ${days} days`,
    agoDays: (days: number) => `${days} days ago`,
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December'
  },
  de: {
    today: 'heute',
    yesterday: 'gestern',
    tomorrow: 'morgen',
    inDays: (days: number) => `in ${days} Tagen`,
    agoDays: (days: number) => `vor ${days} Tagen`,
    january: 'Januar',
    february: 'Februar',
    march: 'März',
    april: 'April',
    may: 'Mai',
    june: 'Juni',
    july: 'Juli',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December'
  }
}

type TimeDisplayMode = 'daysFromToday' | 'date'

type TimeDisplayProps = {
  date: Date,
  mode?: TimeDisplayMode,
}

/**
 * A Component for displaying time and dates in a unified fashion
 */
export const TimeDisplay = ({
  overwriteTranslation,
  date,
  mode = 'daysFromToday'
}: PropsForTranslation<TimeDisplayTranslation, TimeDisplayProps>) => {
  const translation = useTranslation(defaultTimeDisplayTranslations, overwriteTranslation)
  const difference = new Date().setHours(0, 0, 0, 0).valueOf() - new Date(date).setHours(0, 0, 0, 0).valueOf()
  const isBefore = difference > 0
  const differenceInDays = Math.floor(Math.abs(difference) / (1000 * 3600 * 24))

  let displayString
  if (differenceInDays === 0) {
    displayString = translation.today
  } else if (differenceInDays === 1) {
    displayString = isBefore ? translation.yesterday : translation.tomorrow
  } else {
    displayString = isBefore ? translation.agoDays(differenceInDays) : translation.inDays(differenceInDays)
  }
  const monthToTranslation: { [key: number]: string } = {
    0: translation.january,
    1: translation.february,
    2: translation.march,
    3: translation.april,
    4: translation.may,
    5: translation.june,
    6: translation.july,
    7: translation.august,
    8: translation.september,
    9: translation.october,
    10: translation.november,
    11: translation.december
  } as const

  let fullString
  if (mode === 'daysFromToday') {
    fullString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} - ${displayString}`
  } else {
    fullString = `${date.getDate()}. ${monthToTranslation[date.getMonth()]} ${date.getFullYear()}`
  }

  return (
    <span>
      {fullString}
    </span>
  )
}
