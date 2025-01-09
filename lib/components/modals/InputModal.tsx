import { Input } from '../user-input/Input'
import type { InputProps } from '../user-input/Input'
import type { ConfirmDialogProps } from './ConfirmDialog'
import { ConfirmDialog } from './ConfirmDialog'

export type InputModalProps = ConfirmDialogProps & {
  inputs: InputProps[],
}

/**
 * A modal for receiving multiple inputs
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
