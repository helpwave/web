import type { PropsWithChildren } from 'react'
import { tw, tx } from '@twind/core'

export type SectionProps = PropsWithChildren<{ className?: string, titleText?: string  }>

/**
 * A component for a section
 */
export const Section = ({ children, titleText, className }: SectionProps) => {
  return (
    <div className={tx('@(flex flex-col section-padding gap-y-2)', className)}>
      {titleText && <h2 className={tw('font-bold font-space text-3xl')}>{titleText}</h2>}
      {children}
    </div>
  )
}
