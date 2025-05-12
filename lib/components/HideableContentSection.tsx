import { useState, type PropsWithChildren, type ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

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
    <div className="col">
      <div
        className={clsx('row justify-between items-center', { 'cursor-pointer': !disabled })}
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
