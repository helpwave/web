import type { Languages } from '../../hooks/useLanguage'
import type { ConfirmDialogProps } from './ConfirmDialog'
import { ConfirmDialog } from './ConfirmDialog'
import type { InputProps } from '../user_input/Input'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { Input } from '../user_input/Input'

export type InputModalProps = ConfirmDialogProps & {
  inputs: InputProps[]
}

/**
 * Description
 */
export const InputModal = ({
  inputs,
  buttonOverwrites,
  ...restProps
}: InputModalProps) => {
  return (
    <ConfirmDialog
      buttonOverwrites={buttonOverwrites}
      {...restProps}
    >
      {inputs.map((inputProps, index) => <Input key={`input ${index}`} {...inputProps}/>)}
    </ConfirmDialog>
  )
}
