import { useState } from 'react'
import type { TextareaProps } from '../user-input/Textarea'
import { Textarea } from '../user-input/Textarea'

export type TextareaExampleProps = Omit<TextareaProps, 'onChange'|'onEditCompleted'>

/**
 * Example for the Textarea component
 */
export const TextareaExample = ({
  value,
  ...props
}: TextareaExampleProps) => {
  const [text, setText] = useState<string>(value as string)
  return (
    <Textarea
      {...props}
      value={text}
      onChange={setText}
      onEditCompleted={setText}
    />
  )
}
