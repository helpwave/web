import { tw } from '../../twind'
import type { PropsWithChildren } from 'react'
import type { ModalProps } from './Modal'
import { Modal } from './Modal'
import type { ButtonColorType } from '../Button'
import { Button } from '../Button'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'

type ConfirmDialogTranslation = {
  confirm: string,
  cancel: string,
  decline: string
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
  color?: ButtonColorType,
  disabled?: boolean
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
  buttonOverwrites?: [ButtonOverwriteType, ButtonOverwriteType, ButtonOverwriteType]
}

/**
 * A Dialog for asking the user for Confirmation
 *
 * To require an answer omit the onBackgroundClick
 */
export const ConfirmDialog = ({
  language,
  children,
  onCancel,
  onConfirm,
  onDecline,
  confirmType = 'positive',
  buttonOverwrites,
  ...restProps
}: PropsWithLanguage<ConfirmDialogTranslation, PropsWithChildren<ConfirmDialogProps>>) => {
  const translation = useTranslation(language, defaultConfirmDialogTranslation)

  return (
    <Modal {...restProps}>
      {children}
      <div className={tw('flex flex-row mt-3 gap-x-4 justify-end')}>
        {onCancel && (
          <Button color={buttonOverwrites?.[0].color ?? 'neutral'} onClick={onCancel} disabled={buttonOverwrites?.[0].disabled ?? false}>
            {buttonOverwrites?.[0].text ?? translation.cancel}
          </Button>
        )}
        {onDecline && (
          <Button color={buttonOverwrites?.[1].color ?? 'negative'} onClick={onDecline} disabled={buttonOverwrites?.[1].disabled ?? false}>
            {buttonOverwrites?.[1].text ?? translation.decline}
          </Button>
        )}
        <Button autoFocus color={buttonOverwrites?.[2].color ?? confirmType} onClick={onConfirm} disabled={buttonOverwrites?.[2].disabled ?? false}>
          {buttonOverwrites?.[2].text ?? translation.confirm}
        </Button>
      </div>
    </Modal>
  )
}
