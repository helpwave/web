import { Button } from '@helpwave/common/components/Button'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { getConfig } from '@/utils/config'

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

export const FeedbackButton = ({ language }: PropsWithLanguage) => {
  const config = getConfig()
  const translation = useTranslation(language, defaultFeedbackButtonTranslation)

  const onClick = () => window.open(config.feedbackFormUrl, '_blank')

  return (
    <Button variant="tertiary" color="neutral" onClick={onClick}>
      {translation.text}
    </Button>
  )
}
