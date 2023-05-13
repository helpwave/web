import { tw, tx, css } from '../../twind'
import type { TextareaHTMLAttributes } from 'react'
import { forwardRef, useState } from 'react'

type TextareaProps = {
  headline?: string,
  id?: string,
  resizable?: boolean,
  onChangeText?: (text: string) => void,
  disclaimer?: string
} & Omit<TextareaHTMLAttributes<Element>, 'id'>

const noop = () => { /* noop */ }

const globalStyles = css`
  /* onfocus textarea border color */
  .textarea-wrapper:focus-within {
    @apply border-hw-primary-700;
  }
`

/**
 * A Textarea component for inputting longer texts
 *
 * The State is managed by the parent
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ headline, id, resizable = false, onChangeText = noop, disclaimer, ...props }: TextareaProps, ref) {
  const [hasFocus, setHasFocus] = useState(false)

  return (
    <div className={tw(globalStyles)}>
      <div className={`textarea-wrapper ${tw('relative shadow border-2 border-gray-300 rounded-lg')}`}>
        <label className={tw('mx-3 mt-3 block text-gray-700 font-bold')} htmlFor={id}>
          {headline}
        </label>
        <textarea
          ref={ref}
          id={id}
          className={tx('pt-0 border-transparent focus:border-transparent focus:ring-0 h-32 appearance-none border w-full text-gray-700 leading-tight focus:outline-none', { 'resize-none': !resizable })}
          onChange={(event) => {
            onChangeText(event.target.value)
            if (props.onChange !== undefined) {
              props.onChange(event)
            }
          }}
          onFocus={event => {
            setHasFocus(true)
            if (props.onFocus !== undefined) {
              props.onFocus(event)
            }
          }}
          onBlur={event => {
            setHasFocus(false)
            if (props.onBlur !== undefined) {
              props.onBlur(event)
            }
          }}
          {...props}
        >
      </textarea>
      </div>
      {(hasFocus && disclaimer) && (
        <label className={tw('text-hw-negative-500')}>
          {disclaimer}
        </label>
      )}
    </div>
  )
})
