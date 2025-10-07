import { type PropsWithChildren } from 'react'
import type {
  DialogProps,
  PropsForTranslation,
  Translation } from '@helpwave/hightide'
import {
  Dialog,
  MarkdownInterpreter,
  SolidButton,
  useTranslation
} from '@helpwave/hightide'
import Link from 'next/link'
import { getConfig } from '@/utils/config'
import clsx from 'clsx'

const config = getConfig()

type StagingDisclaimerDialogTranslation = {
  title: string,
  message: string,
  dismiss: string,
  imprint: string,
  privacy: string,
  confirm: string,
}

const defaultStagingDisclaimerTranslation: Translation<StagingDisclaimerDialogTranslation> = {
  en: {
    title: 'Development and preview instance',
    message: 'This public instance of helpwave tasks is for \\b{development and preview purposes}. Please make sure to \\b{only} enter \\b{non-confidential testing data}. This instance can be \\negative{\\b{deleted at any time}}.',
    dismiss: 'Dismiss',
    imprint: 'Imprint',
    privacy: 'Privacy',
    confirm: 'Confirm',
  },
  de: {
    title: 'Entwicklungs- und Vorschauinstanz',
    message: 'Diese öffentliche Instanz von helpwave tasks ist für \\b{Entwicklungs- und Vorschauzwecke} gedacht. Bitte stellen Sie sicher, dass Sie \\b{ausschließlich nicht-vertrauliche Testdaten} eingeben. Diese Instanz kann \\negative{\\b{jederzeit gelöscht}} werden.',
    dismiss: 'Schließen',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    confirm: 'Bestätigen',
  }
}

type StagingDisclaimerModalProps = Omit<DialogProps, 'titleElement' | 'description'> & {
  onConfirm?: () => void,
}

/**
 * A Modal for selecting the Language
 *
 * The State of open needs to be managed by the parent
 */
export const StagingDisclaimerModal = ({
                                         overwriteTranslation,
                                         onConfirm,
                                         ...modalProps
                                       }: PropsForTranslation<StagingDisclaimerDialogTranslation, PropsWithChildren<StagingDisclaimerModalProps>>) => {
  const translation = useTranslation([defaultStagingDisclaimerTranslation], overwriteTranslation)

  return (
    <Dialog
      {...modalProps}
      titleElement={translation('title')}
      description={(<MarkdownInterpreter text={translation('message')}/>)}
      className={clsx('z-20', modalProps.className)}
      backgroundClassName="z-10"
    >
      <div className="flex-row-8">
        <Link className="text-primary hover:brightness-75 font-bold" href={config.imprintUrl}>
          {translation('imprint')}
        </Link>
        <Link className="text-primary hover:brightness-75 font-bold" href={config.privacyUrl}>
          {translation('privacy')}
        </Link>
      </div>
      <div className="flex-row-0 justify-end">
        <SolidButton color="positive" onClick={onConfirm}>
          {translation('confirm')}
        </SolidButton>
      </div>
    </Dialog>
  )
}
