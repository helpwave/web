import type { Languages } from '../../hooks/useLanguage'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'

export type RelativeDateDisplayTranslation = {
  today: string,
  tomorrow: string,
  yesterday: string,
  secondsIn: (seconds: number) => string,
  secondsAgo: (seconds: number) => string,
  minutesIn: (minutes: number) => string,
  minutesAgo: (minutes: number) => string,
  hoursIn: (hours: number) => string,
  hoursAgo: (hours: number) => string,
  daysIn: (days: number) => string,
  daysAgo: (days: number) => string,
  weeksIn: (weeks: number) => string,
  weeksAgo: (weeks: number) => string,
  yearsIn: (years: number) => string,
  yearsAgo: (years: number) => string
}

const defaultRelativeDateDisplayTranslation: Record<Languages, RelativeDateDisplayTranslation> = {
  en: {
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    secondsIn: seconds => seconds === 1 ? `In ${seconds} Second` : `In ${seconds} Seconds`,
    secondsAgo: seconds => seconds === 1 ? `${seconds} Second ago` : `${seconds} Seconds ago`,
    minutesIn: minutes => minutes === 1 ? `In ${minutes} Minute` : `In ${minutes} Minutes`,
    minutesAgo: minutes => minutes === 1 ? `${minutes} Minute ago` : `${minutes} Minutes ago`,
    hoursIn: hours => hours === 1 ? `In ${hours} Hour` : `In ${hours} Hours`,
    hoursAgo: hours => hours === 1 ? `${hours} Hour ago` : `${hours} Hours ago`,
    daysIn: days => days === 1 ? `In ${days} Day` : `In ${days} Days`,
    daysAgo: days => days === 1 ? `${days} Day ago` : `${days} Days ago`,
    weeksIn: weeks => weeks === 1 ? `In ${weeks} Week` : `In ${weeks} Weeks`,
    weeksAgo: weeks => weeks === 1 ? `${weeks} Week ago` : `${weeks} Weeks ago`,
    yearsIn: years => years === 1 ? `In ${years} Year` : `In ${years} Years`,
    yearsAgo: years => years === 1 ? `${years} Year ago` : `${years} Years ago`
  },
  de: {
    today: 'Heute',
    tomorrow: 'Morgen',
    yesterday: 'Gestern',
    secondsIn: seconds => seconds === 1 ? `In ${seconds} Sekunde` : `In ${seconds} Sekunden`,
    secondsAgo: seconds => seconds === 1 ? `Vor ${seconds} Sekunde` : `Vor ${seconds} Sekunden`,
    minutesIn: minutes => minutes === 1 ? `In ${minutes} Minute` : `In ${minutes} Minuten`,
    minutesAgo: minutes => minutes === 1 ? `Vor ${minutes} Minute` : `Vor ${minutes} Minuten`,
    hoursIn: hours => hours === 1 ? `In ${hours} Stunde` : `In ${hours} Stunden`,
    hoursAgo: hours => hours === 1 ? `Vor ${hours} Stunde` : `Vor ${hours} Stunden`,
    daysIn: days => days === 1 ? `In ${days} Tag` : `In ${days} Tagen`,
    daysAgo: days => days === 1 ? `Vor ${days} Tag` : `Vor ${days} Tagen`,
    weeksIn: weeks => weeks === 1 ? `In ${weeks} Woche` : `In ${weeks} Wochen`,
    weeksAgo: weeks => weeks === 1 ? `Vor ${weeks} Woche` : `Vor ${weeks} Wochen`,
    yearsIn: years => years === 1 ? `In ${years} Jahr` : `In ${years} Jahren`,
    yearsAgo: years => years === 1 ? `Vor ${years} Jahr` : `Vor ${years} Jahren`
  }
}

export type RelativeDateDisplayProps = {
  date: string
}

export const RelativeDateDisplay = ({
  overwriteTranslation
}: PropsForTranslation<RelativeDateDisplayTranslation, RelativeDateDisplayProps>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const translation = useTranslation(defaultRelativeDateDisplayTranslation, overwriteTranslation)
  // TODO write this component
}
