import { type PropsWithChildren } from 'react'
import type { ConfirmDialogProps } from '@helpwave/common/components/modals/ConfirmDialog'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'

type StagingDisclaimerModalTranslation = {
  title: string,
  message: string,
  dismiss: string
}

const defaultStagingDisclaimerTranslation = {
  en: {
    title: 'Development and preview instance',
    message: 'This public instance of helpwave tasks is for \\b{development and preview purposes}. Please make sure to \\b{only} enter \\b{non-confidential testing data}. This instance can be \\negative{\\b{deleted at any time}}.',
    dismiss: 'Dismiss',
  },
  de: {
    title: 'Entwicklungs- und Vorschauinstanz',
    message: 'Diese öffentliche Instanz von helpwave tasks ist für \\b{Entwicklungs- und Vorschauzwecke} gedacht. Bitte stellen Sie sicher, dass Sie \\b{ausschließlich nicht-vertrauliche Testdaten} eingeben. Diese Instanz kann \\negative{\\b{jederzeit gelöscht}} werden.',
    dismiss: 'Schließen',
  }
}

type StagingDisclaimerModalProps = Pick<ConfirmDialogProps, 'id' | 'isOpen' | 'onConfirm' | 'onBackgroundClick' | 'onCloseClick' | 'onCancel'>

/**
 * A Modal for selecting the Language
 *
 * The State of open needs to be managed by the parent
 */
export const StagingDisclaimerModal = ({
  language,
  ...modalProps
}: PropsWithLanguage<StagingDisclaimerModalTranslation, PropsWithChildren<StagingDisclaimerModalProps>>) => {
  const translation = useTranslation(language, defaultStagingDisclaimerTranslation)

  return (
    <ConfirmDialog
      {...modalProps}
      titleText={translation.title}
      description={(
        <p>
          <MarkdownInterpreter text={translation.message}/>
        </p>
      )}
    />
  )
}
