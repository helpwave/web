import { Button } from '@helpwave/common/components/Button'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

type FeedbackButtonTranslation = {
  text: string
}

const defaultFeedbackButtonTranslation: Record<Languages, FeedbackButtonTranslation> = {
  en: {
    text: 'Issue or Feedback?'
  },
  de: {
    text: 'Fehler oder Feedback?'
  }
}

export const FeedbackButton = ({ language }: PropsWithLanguage<FeedbackButtonTranslation>) => {
  const translation = useTranslation(language, defaultFeedbackButtonTranslation)

  const onClick = () => window.open('https://share-eu1.hsforms.com/1Libxb_ANSm-CpMCQ37Ti6Qfsrtd', '_blank')

  return (
    <Button variant="tertiary" color="neutral" onClick={onClick}>
      {translation.text}
    </Button>
  )
}
