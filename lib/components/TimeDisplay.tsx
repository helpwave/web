import type { Languages } from '../hooks/useLanguage'
import type { PropsWithLanguage } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'

type TimeDisplayTranslation = {
  today: string,
  yesterday: string,
  tomorrow: string,
  inDays: (days: number) => string,
  agoDays: (days: number) => string
}

const defaultTimeDisplayTranslations: Record<Languages, TimeDisplayTranslation> = {
  en: {
    today: 'today',
    yesterday: 'yesterday',
    tomorrow: 'tomorrow',
    inDays: (days: number) => `in ${days} days`,
    agoDays: (days: number) => `${days} days ago`
  },
  de: {
    today: 'heute',
    yesterday: 'gestern',
    tomorrow: 'morgen',
    inDays: (days: number) => `in ${days} Tagen`,
    agoDays: (days: number) => `vor ${days} Tagen`
  }
}

type TimeDisplayProps = {
  date: Date
}

export const TimeDisplay = ({
  language,
  date
}: PropsWithLanguage<TimeDisplayTranslation, TimeDisplayProps>) => {
  const translation = useTranslation(language, defaultTimeDisplayTranslations)
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

  return (
    <span>
      {`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} - ${displayString}`}
    </span>
  )
}
