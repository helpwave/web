import type { TextareaHTMLAttributes } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import useSaveDelay from '../../hooks/useSaveDelay'
import { noop } from '../../util/noop'
import type { LabelProps } from './Label'
import { Label } from './Label'

export type TextareaProps = {
  /** Outside the area */
  label?: Omit<LabelProps, 'id'>,
  /** Inside the area */
  headline?: string,
  id?: string,
  resizable?: boolean,
  onChange?: (text: string) => void,
  disclaimer?: string,
  onEditCompleted?: (text: string) => void,
  defaultStyle?: boolean,
} & Omit<TextareaHTMLAttributes<Element>, 'id' | 'onChange'>

/**
 * A Textarea component for inputting longer texts
 *
 * The State is managed by the parent
 */
export const Textarea = ({
  label,
  headline,
  id,
  resizable = false,
  onChange = noop,
  disclaimer,
  onBlur = noop,
  onEditCompleted = noop,
  defaultStyle = true,
  className,
  ...props
}: TextareaProps) => {
  const [hasFocus, setHasFocus] = useState(false)
  const { restartTimer, clearUpdateTimer } = useSaveDelay(() => undefined, 3000)

  const onEditCompletedWrapper = (text: string) => {
    onEditCompleted(text)
    clearUpdateTimer()
  }

  return (
    <div className="w-full">
      {label && (<Label {...label} htmlFor={id} className={clsx('mb-1', label.className)} labelType={label.labelType ?? 'labelSmall'}/>)}
      <div className={`${clsx(' bg-surface text-on-surface focus-within:border-primary relative', { 'shadow border-2 border-gray-300 hover:border-primary rounded-lg': defaultStyle })}`}>
        {headline && (
          <span className="mx-3 mt-3 block text-gray-700 font-bold">
            {headline}
          </span>
        )}
        <textarea
          id={id}
          className={clsx('pt-0 px-3 border-transparent focus:border-transparent focus:ring-0 appearance-none border w-full leading-tight focus:outline-none', { 'resize-none': !resizable, 'h-32': defaultStyle, 'mt-3': !headline }, className)}
          onChange={(event) => {
            const value = event.target.value
            restartTimer(() => {
              onEditCompletedWrapper(value)
            })
            onChange(value)
          }}
          onFocus={() => {
            setHasFocus(true)
          }}
          onBlur={(event) => {
            onBlur(event)
            onEditCompletedWrapper(event.target.value)
            setHasFocus(false)
          }}
          {...props}
        >
      </textarea>
      </div>
      {(hasFocus && disclaimer) && (
        <label className="text-negative">
          {disclaimer}
        </label>
      )}
    </div>
  )
}
