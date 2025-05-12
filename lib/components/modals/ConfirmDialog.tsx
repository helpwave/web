import type { PropsWithChildren } from 'react'
import type { SolidButtonColor } from '../Button'
import { SolidButton } from '../Button'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { Modal, type ModalProps } from './Modal'

type ConfirmDialogTranslation = {
  confirm: string,
  cancel: string,
  decline: string,
}

export type ConfirmDialogType = 'positive' | 'negative' | 'neutral'

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

export type ButtonOverwriteType = {
  text?: string,
  color?: SolidButtonColor,
  disabled?: boolean,
}

export type ConfirmDialogProps = ModalProps & {
  isShowingDecline?: boolean,
  requireAnswer?: boolean,
  onCancel?: () => void,
  onConfirm: () => void,
  onDecline?: () => void,
  confirmType?: ConfirmDialogType,
  /**
   * Order: Cancel, Decline, Confirm
   */
  buttonOverwrites?: [ButtonOverwriteType, ButtonOverwriteType, ButtonOverwriteType],
}

/**
 * A Dialog for asking the user for Confirmation
 *
 * To require an answer omit the onBackgroundClick
 */
export const ConfirmDialog = ({
  overwriteTranslation,
  children,
  onCancel,
  onConfirm,
  onDecline,
  confirmType = 'positive',
  buttonOverwrites,
  ...restProps
}: PropsForTranslation<ConfirmDialogTranslation, PropsWithChildren<ConfirmDialogProps>>) => {
  const translation = useTranslation(defaultConfirmDialogTranslation, overwriteTranslation)

  const mapping: Record<ConfirmDialogType, SolidButtonColor> = {
    neutral: 'primary',
    negative: 'negative',
    positive: 'positive'
  }

  return (
    <Modal {...restProps}>
      {children}
      <div className="row mt-3 gap-x-4 justify-end">
        {onCancel && (
          <SolidButton
            color={buttonOverwrites?.[0].color ?? 'primary'}
            onClick={onCancel}
            disabled={buttonOverwrites?.[0].disabled ?? false}
          >
            {buttonOverwrites?.[0].text ?? translation.cancel}
          </SolidButton>
        )}
        {onDecline && (
          <SolidButton
            color={buttonOverwrites?.[1].color ?? 'negative'}
            onClick={onDecline}

            disabled={buttonOverwrites?.[1].disabled ?? false}
          >
            {buttonOverwrites?.[1].text ?? translation.decline}
          </SolidButton>
        )}
        <SolidButton
          autoFocus
          color={buttonOverwrites?.[2].color ?? mapping[confirmType]}
          onClick={onConfirm}
          disabled={buttonOverwrites?.[2].disabled ?? false}
        >
          {buttonOverwrites?.[2].text ?? translation.confirm}
        </SolidButton>
      </div>
    </Modal>
  )
}
