import type { Languages } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { ConfirmDialog, type ConfirmDialogProps } from '@helpwave/hightide'

type ReSignInModalTranslation = {
  pleaseReSignIn: string,
  description: string,
  yes: string,
  no: string,
}

type ReSignInModalProps = Omit<ConfirmDialogProps, 'title'|'description'|'children'>

const defaultReSignInModalTranslation: Record<Languages, ReSignInModalTranslation> = {
  en: {
    pleaseReSignIn: 'You triggered an action that requires a Re-Signin!',
    description: 'To see your organizational changes, you need to re-signin into helpwave tasks. Your changes will be visible afterwards.',
    yes: 'Yes, sign me out!',
    no: 'No, later.'
  },
  de: {
    pleaseReSignIn: 'Deine Aktion erfordert eine erneute Anmeldung!',
    description: 'Um deine organisatorischen Änderungen zu sehen, musst du dich erneut bei helpwave tasks anmelden. Danach werden deine Änderungen sichtbar.',
    yes: 'Ja, logge mich aus!',
    no: 'Nein, später.'
  }
}
export const ReSignInModal = ({ overwriteTranslation, titleText, ...modalProps }: PropsForTranslation<ReSignInModalTranslation, ReSignInModalProps>) => {
  const translation = useTranslation(defaultReSignInModalTranslation, overwriteTranslation)

  return (
    <ConfirmDialog
      backgroundClassName="w-5"
      titleText={titleText ?? translation.pleaseReSignIn}
      buttonOverwrites={[
        {},
        {
          text: translation.no,
          color: 'negative'
        },
        {
          text: translation.yes,
          color: 'positive'
        }
      ]}
      {...modalProps}
    >
      <span>{translation.description}</span>
    </ConfirmDialog>
  )
}
