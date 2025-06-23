import { type PropsWithChildren } from 'react'
import type { ConfirmDialogProps, PropsForTranslation, Translation } from '@helpwave/hightide'
import { ConfirmDialog, MarkdownInterpreter, useTranslation } from '@helpwave/hightide'
import Link from 'next/link'
import { getConfig } from '@/utils/config'

const config = getConfig()

type StagingDisclaimerDialogTranslation = {
  title: string,
  message: string,
  dismiss: string,
  imprint: string,
  privacy: string,
}

const defaultStagingDisclaimerTranslation: Translation<StagingDisclaimerDialogTranslation> = {
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

type StagingDisclaimerModalProps = Pick<ConfirmDialogProps, 'isOpen' | 'onConfirm'>

/**
 * A Modal for selecting the Language
 *
 * The State of open needs to be managed by the parent
 */
export const StagingDisclaimerModal = ({
                                         overwriteTranslation,
                                         ...modalProps
                                       }: PropsForTranslation<StagingDisclaimerDialogTranslation, PropsWithChildren<StagingDisclaimerModalProps>>) => {
  const translation = useTranslation(defaultStagingDisclaimerTranslation, overwriteTranslation)

  return (
    <ConfirmDialog
      {...modalProps}
      headerProps={{
        titleText: translation.title,
        description: (
          <>
            <p><MarkdownInterpreter text={translation.message}/></p>
            <div className="row gap-x-8 mt-2">
              <Link className="text-primary hover:brightness-75 font-bold" href={config.imprintUrl}>
                {translation.imprint}
              </Link>
              <Link className="text-primary hover:brightness-75 font-bold" href={config.privacyUrl}>
                {translation.privacy}
              </Link>
            </div>
          </>
        )
      }}
    />
  )
}
