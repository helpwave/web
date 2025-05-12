import { SolidButton } from '@helpwave/common/components/Button'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { getConfig } from '@/utils/config'

type FeedbackButtonTranslation = {
  text: string,
}

const defaultFeedbackButtonTranslation: Record<Languages, FeedbackButtonTranslation> = {
  en: {
    text: 'Issue or Feedback?'
  },
  de: {
    text: 'Fehler oder Feedback?'
  }
}

export const FeedbackButton = ({ overwriteTranslation }: PropsForTranslation<FeedbackButtonTranslation>) => {
  const config = getConfig()
  const translation = useTranslation(defaultFeedbackButtonTranslation, overwriteTranslation)

  const onClick = () => window.open(config.feedbackFormUrl, '_blank')

  return (
    <SolidButton color="secondary" onClick={onClick}>
      {translation.text}
    </SolidButton>
  )
}
