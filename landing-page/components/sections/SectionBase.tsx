import type { PropsWithChildren } from 'react'
import { tx } from '@twind/core'

type BackgroundColor = 'white' | 'black' | 'gray' | 'darkSecondary' | 'darkPrimary'

type SectionBaseProps = PropsWithChildren & {
  isFirstSection?: boolean,
  useDefaultStyle?: boolean,
  backgroundColor?: BackgroundColor,
  className?: string
}

export const SectionBase = ({
  children,
  isFirstSection = false,
  useDefaultStyle = true,
  backgroundColor = 'white',
  className,
}: SectionBaseProps) => {
  return (
    <div className={tx('flex flex-col items-center w-full', {
      'bg-white': backgroundColor === 'white',
      'bg-gray-100': backgroundColor === 'gray',
      'bg-black': backgroundColor === 'black',
      'bg-hw-secondary-800': backgroundColor === 'darkSecondary',
      'bg-hw-primary-900': backgroundColor === 'darkPrimary'
    })}>
      <div
        className={tx(
          className,
          {
            'max-w-[1200px] desktop:px-24 tablet:px-12 mobile:px-6 py-16': useDefaultStyle,
            'pt-32': useDefaultStyle && isFirstSection
          }
        )}
      >
        {children}
      </div>
    </div>
  )
}
