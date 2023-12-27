import { type PropsWithChildren } from 'react'
import { tw } from '../../twind'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { Button } from '../Button'
import { Modal, type ModalProps } from './Modal'

type StagingDisclaimerModalTranslation = {
  title: string,
  message: string,
  dismiss: string
}

const defaultStagingDisclaimerTranslation = {
  en: {
    title: 'Development and preview instance',
    message: 'This public instance of helpwave tasks is for development and preview purposes. Please make sure to enter non-confidential testing data. This instance can be wipped out at any time.',
    dismiss: 'Dismiss',
  },
  de: {
    title: 'Entwicklungs- und Vorschauinstanz',
    message: 'Diese öffentliche Instanz von helpwave tasks ist für Entwicklungs- und Vorschauzwecke gedacht. Bitte stellen Sie sicher, dass Sie nicht-vertrauliche Testdaten eingeben. Diese Instanz kann jederzeit ausgelöscht werden.',
    dismiss: 'Schließen',
  }
}

type StagingDisclaimerModalProps = ModalProps & {
  onDone: () => void
}

/**
 * A Modal for selecting the Language
 *
 * The State of open needs to be managed by the parent
 */
export const StagingDisclaimerModal = ({
  onDone,
  onBackgroundClick,
  language: maybeLanguage,
  ...modalProps
}: PropsWithLanguage<StagingDisclaimerModalTranslation, PropsWithChildren<StagingDisclaimerModalProps>>) => {
  const translation = useTranslation(maybeLanguage, defaultStagingDisclaimerTranslation)

  return (
    <Modal
      titleText={translation.title}
      onBackgroundClick={(eventData) => {
        onDone()

        if (onBackgroundClick) {
          onBackgroundClick(eventData)
        }
      }}
      {...modalProps}
    >
      <div className={tw('pt-2 w-fit')}>
        <p>
          {translation.message}
        </p>
        <div className={tw('flex flex-row mt-3 gap-x-4 justify-end')}>
          <Button autoFocus color="positive" onClick={onDone}>
            {translation.dismiss}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
