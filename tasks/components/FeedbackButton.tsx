import { SolidButton } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import type { Languages } from '@helpwave/hightide'
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

type FeedbackButtonProps = {
  className?: string,
}

export const FeedbackButton = ({ overwriteTranslation, className }: PropsForTranslation<FeedbackButtonTranslation, FeedbackButtonProps>) => {
  const config = getConfig()
  const translation = useTranslation(defaultFeedbackButtonTranslation, overwriteTranslation)

  const onClick = () => window.open(config.feedbackFormUrl, '_blank')

  return (
    <SolidButton color="primary" onClick={onClick} className={className}>
      {translation.text}
    </SolidButton>
  )
}
