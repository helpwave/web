import type { ConfirmDialogProps } from './ConfirmDialog'
import { ConfirmDialog } from './ConfirmDialog'
import type { InputProps } from '../user_input/Input'
import { Input } from '../user_input/Input'

export type InputModalProps = ConfirmDialogProps & {
  inputs: InputProps[]
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
