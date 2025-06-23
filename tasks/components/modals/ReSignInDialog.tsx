import type { Translation } from '@helpwave/hightide'
import { ConfirmDialog, type ConfirmDialogProps, type PropsForTranslation, useTranslation } from '@helpwave/hightide'

type ReSignInDialogTranslation = {
  pleaseReSignIn: string,
  description: string,
  yes: string,
  no: string,
}

type ReSignInDialogProps = Omit<ConfirmDialogProps, 'title' | 'description' | 'children'>

const defaultReSignInModalTranslation: Translation<ReSignInDialogTranslation> = {
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
export const ReSignInDialog = ({
                                overwriteTranslation,
                                headerProps,
                                ...modalProps
                              }: PropsForTranslation<ReSignInDialogTranslation, ReSignInDialogProps>) => {
  const translation = useTranslation(defaultReSignInModalTranslation, overwriteTranslation)

  return (
    <ConfirmDialog
      backgroundClassName="w-5"
      headerProps={{
        ...headerProps,
        titleText: headerProps?.titleText ?? translation.pleaseReSignIn,
        descriptionText: headerProps?.descriptionText ?? translation.description,
      }}
      buttonOverwrites={[
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
    />
  )
}
