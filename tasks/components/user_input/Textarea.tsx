import { css, tw } from '@helpwave/common/twind'
import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = {
  headline?: string,
  placeholder?: string,
  message?: string,
  id?: string,
  onChange: (text: string) => void,
  props?: TextareaHTMLAttributes<HTMLTextAreaElement>
}

const globalStyles = css`
  .textarea-wrapper:focus-within {
    @apply border-hw-primary-700;
  }
`
export const Textarea = ({ headline, placeholder, message, id } : TextareaProps) => {
  return (
    <div className={tw(globalStyles)}>
      <div className={`textarea-wrapper ${tw('relative shadow border-1 border-gray-300 rounded-lg')}`}>
        <label className={tw('mx-3 mt-3 block text-gray-700 font-bold')} htmlFor={id}>
          {headline}
        </label>
        <textarea defaultValue={message} className={tw('pt-0 border-transparent focus:border-transparent focus:ring-0 h-32 resize-none appearance-none border w-full text-gray-700 leading-tight focus:outline-none')} id={id} placeholder={placeholder}>
      </textarea>
      </div>
    </div>
  )
}
