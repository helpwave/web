import { useState, type PropsWithChildren, type ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { tw, tx } from '@helpwave/style-themes/twind'

export type HideableContentSectionProps = PropsWithChildren & {
  initiallyOpen?: boolean,
  disabled: boolean,
  header: ReactNode,
}

/**
 * A Component to hide and show
 */
export const HideableContentSection = ({
  initiallyOpen = true,
  disabled,
  children,
  header
}: HideableContentSectionProps) => {
  const [open, setOpen] = useState(initiallyOpen)
  return (
    <div className={tw('flex flex-col gap-y-2')}>
      <div
        className={tx('flex flex-row justify-between items-center', { 'cursor-pointer': !disabled })}
        onClick={() => {
          if (!disabled) {
            setOpen(!open)
          }
        }}
      >
        <div>
          {header}
        </div>
        {!disabled && (open ? <ChevronUp/> : <ChevronDown/>)}
      </div>
      {open && (
        <div>
          {children}
        </div>
      )}
    </div>
  )
}
