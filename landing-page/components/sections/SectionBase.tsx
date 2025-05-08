import type { PropsWithChildren } from 'react'
import { clsx } from 'clsx'

type BackgroundColor = 'variant' | 'dark' |  'secondary' | 'primary' | 'none'

type SectionBaseProps = PropsWithChildren & {
  useDefaultStyle?: boolean,
  backgroundColor?: BackgroundColor,
  outerClassName?: string,
  className?: string,
}

export const SectionBase = ({
  children,
  useDefaultStyle = true,
  backgroundColor = 'none',
  outerClassName,
  className,
}: SectionBaseProps) => {
  return (
    <div className={clsx('col items-center w-full', {
      'bg-section-variant text-section-on-variant': backgroundColor === 'variant',
      'bg-section-dark text-section-on-dark': backgroundColor === 'dark',
      'bg-secondary text-white': backgroundColor === 'secondary',
      'bg-primary text-on-primary': backgroundColor === 'primary',
      'section-padding': useDefaultStyle
    }, outerClassName)}>
      <div
        className={clsx(
          className,
          {
            'max-w-[1200px]': useDefaultStyle,
          }
        )}
      >
        {children}
      </div>
    </div>
  )
}
