import { tw, tx, css } from '../../twind'
import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = {
  headline?: string,
  id?: string,
  resizable?: boolean,
  onChange?: (text: string) => void
} & Omit<TextareaHTMLAttributes<Element>, 'id' | 'onChange'>

const noop = () => { /* noop */ }

const globalStyles = css`
  /* onfocus textarea border color */
  .textarea-wrapper:focus-within {
    @apply border-hw-primary-700;
  }
`
export const Textarea = ({ headline, id, resizable = false, onChange = noop, ...props }: TextareaProps) => {
  return (
    <div className={tw(globalStyles)}>
      <div className={`textarea-wrapper ${tw('relative shadow border-2 border-gray-300 rounded-lg')}`}>
        <label className={tw('mx-3 mt-3 block text-gray-700 font-bold')} htmlFor={id}>
          {headline}
        </label>
        <textarea
          id={id}
          className={tx('pt-0 border-transparent focus:border-transparent focus:ring-0 h-32 appearance-none border w-full text-gray-700 leading-tight focus:outline-none', { 'resize-none': !resizable })}
          onChange={(event) => onChange(event.target.value)}
          {...props}
        >
      </textarea>
      </div>
    </div>
  )
}
