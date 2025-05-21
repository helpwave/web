import type { Translation } from '@helpwave/hightide'

export type LocaleFormattingTranslation = {
  formatMoney: (amount: number, currency?: string) => string,
  formatDate: (date?: Date) => string | null,
};

const createMoneyFormatter = (locale: string) =>
  (amount: number, currency: string = 'EUR'): string =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount)

const createDateFormatter = (locale: string) =>
  (date?: Date): string | null => {
    if (!date) return null

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: locale === 'en-US'
    }

    const formatted = date.toLocaleString(locale, options)
    return locale === 'de-DE' ? formatted.replace(/(\d{2}:\d{2})$/, '$1 Uhr') : formatted
  }

export const defaultLocaleFormatters: Translation<LocaleFormattingTranslation> = {
  en: {
    formatMoney: createMoneyFormatter('en-US'),
    formatDate: createDateFormatter('en-US')
  },
  de: {
    formatMoney: createMoneyFormatter('de-DE'),
    formatDate: createDateFormatter('de-DE')
  },
}
