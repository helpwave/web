import type { PropsWithChildren } from 'react'
import clsx from 'clsx'

export type SectionProps = PropsWithChildren<{ className?: string, titleText?: string  }>

/**
 * A component for a section
 */
export const Section = ({ children, titleText, className }: SectionProps) => {
  return (
    <div className={clsx('@(flex flex-col px-6 py-3 mobile:px-6 mobile:py-3 tablet:px-8 tablet:py-4 desktop:px-12 desktop:py-6 gap-y-2)', className)}>
      {titleText && <h2 className={clsx('font-bold font-space text-3xl')}>{titleText}</h2>}
      {children}
    </div>
  )
}
