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

export enum ConfirmDialogType{
  Positive = 'Positive',
  Neutral = 'Neutral',
  Negative = 'Negative'
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

type ConfirmDialogProps = ModalProps & {
  isShowingDecline?: boolean,
  requireAnswer?: boolean,
  onCancel?: () => void,
  onConfirm: () => void,
  onDecline?: () => void,
  type: ConfirmDialogType
}

export const ConfirmDialog = ({
  language,
  children,
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
  onDecline,
  onBackgroundClick,
  type = ConfirmDialogType.Positive
}: PropsWithLanguage<ConfirmDialogTranslation, PropsWithChildren<ConfirmDialogProps>>) => {
  const translation = useTranslation(language, defaultConfirmDialogTranslation)
  const confirmationButtonColor = type === ConfirmDialogType.Positive ? 'positive' : type === ConfirmDialogType.Negative ? 'negative' : 'neutral'
  return (
    <Modal
      isOpen={isOpen}
      title={title} description={description}
      onBackgroundClick={onBackgroundClick}
    >
      {children}
      <div className={tw('flex flex-row mt-3 gap-x-4 justify-end')}>
        {onCancel && (
          <Button color="neutral" onClick={onCancel}>
            {translation.cancel}
          </Button>
        )}
        {onDecline && (
          <Button color="negative" onClick={onDecline}>
            {translation.decline}
          </Button>
        )}
        <Button autoFocus color={confirmationButtonColor} onClick={onConfirm}>
          {translation.confirm}
        </Button>
      </div>
    </Modal>
  )
}
