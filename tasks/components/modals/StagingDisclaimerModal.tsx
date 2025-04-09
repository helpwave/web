import { type PropsWithChildren } from 'react'
import type { ConfirmDialogProps } from '@helpwave/common/components/modals/ConfirmDialog'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Link from 'next/link'
import { getConfig } from '@/utils/config'

const config = getConfig()

type StagingDisclaimerModalTranslation = {
  title: string,
  message: string,
  dismiss: string,
  imprint: string,
  privacy: string,
}

const defaultStagingDisclaimerTranslation: Record<Languages, StagingDisclaimerModalTranslation> = {
  en: {
    title: 'Development and preview instance',
    message: 'This public instance of helpwave tasks is for \\b{development and preview purposes}. Please make sure to \\b{only} enter \\b{non-confidential testing data}. This instance can be \\negative{\\b{deleted at any time}}.',
    dismiss: 'Dismiss',
    imprint: 'Imprint',
    privacy: 'Privacy'
  },
  de: {
    title: 'Entwicklungs- und Vorschauinstanz',
    message: 'Diese öffentliche Instanz von helpwave tasks ist für \\b{Entwicklungs- und Vorschauzwecke} gedacht. Bitte stellen Sie sicher, dass Sie \\b{ausschließlich nicht-vertrauliche Testdaten} eingeben. Diese Instanz kann \\negative{\\b{jederzeit gelöscht}} werden.',
    dismiss: 'Schließen',
    imprint: 'Impressum',
    privacy: 'Datenschutz'
  }
}

type StagingDisclaimerModalProps = Pick<ConfirmDialogProps, 'id' | 'isOpen' | 'onConfirm' | 'onBackgroundClick' | 'onCloseClick' | 'onCancel'>

/**
 * A Modal for selecting the Language
 *
 * The State of open needs to be managed by the parent
 */
export const StagingDisclaimerModal = ({
  overwriteTranslation,
  ...modalProps
}: PropsForTranslation<StagingDisclaimerModalTranslation, PropsWithChildren<StagingDisclaimerModalProps>>) => {
  const translation = useTranslation(defaultStagingDisclaimerTranslation, overwriteTranslation)

  return (
    <ConfirmDialog
      {...modalProps}
      titleText={translation.title}
      description={(
        <>
          <p><MarkdownInterpreter text={translation.message}/></p>
          <div className={clsx('flex flex-row gap-x-8 mt-2')}>
            <Link className={clsx('text-hw-primary-600 hover:text-hw-primary-800 font-bold')} href={config.imprintUrl}>
              {translation.imprint}
            </Link>
            <Link className={clsx('text-hw-primary-600 hover:text-hw-primary-800 font-bold')} href={config.privacyUrl}>
              {translation.privacy}
            </Link>
          </div>
        </>
      )}
    />
  )
}
