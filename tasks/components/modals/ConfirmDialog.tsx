import { tw } from '@helpwave/common/twind/index'
import type { PropsWithChildren } from 'react'
import type { ModalProps } from './Modal'
import { Modal } from './Modal'
import { Button } from '../Button'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

type ConfirmDialogTranslation = {
  confirm: string,
  cancel: string,
  decline: string
}

const defaultConfirmDialogTranslation = {
  en: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    decline: 'Decline'
  },
  de: {
    confirm: 'Bestätigen',
    cancel: 'Abbrechen',
    decline: 'Ablehnen'
  }
}

type ConfirmDialogProps = Omit<ModalProps, 'onBackgroundClick'> & {
  isShowingDecline?: boolean,
  requireAnswer?: boolean,
  onClose: (operation: 'confirm' | 'decline' | 'closed') => void
}

export const ConfirmDialog = ({
  language,
  children,
  isOpen,
  title,
  description,
  requireAnswer = false,
  isShowingDecline,
  onClose
}: PropsWithLanguage<ConfirmDialogTranslation, PropsWithChildren<ConfirmDialogProps>>) => {
  const translation = useTranslation(language, defaultConfirmDialogTranslation)
  return (
    <Modal
      isOpen={isOpen}
      title={title} description={description}
      onBackgroundClick={requireAnswer ? undefined : () => { onClose('closed') }}
    >
      {children}
      <div className={tw('flex flex-row mt-3 gap-x-4 justify-end')}>
        {!requireAnswer && (
          <Button color="neutral" onClick={() => onClose('closed')}>
            {translation.cancel}
          </Button>
        )}
        {isShowingDecline && (
          <Button color="negative" onClick={() => onClose('decline')}>
            {translation.decline}
          </Button>
        )}
        <Button autoFocus color="positive" onClick={() => onClose('confirm')}>
          {translation.confirm}
        </Button>
      </div>
    </Modal>
  )
}
