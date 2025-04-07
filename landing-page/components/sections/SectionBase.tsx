import type { PropsWithChildren } from 'react'
import { apply, tx } from '@helpwave/style-themes/twind'

type BackgroundColor = 'white' | 'black' | 'gray' | 'darkSecondary' | 'darkPrimary'

type SectionBaseProps = PropsWithChildren & {
  useDefaultStyle?: boolean,
  backgroundColor?: BackgroundColor,
  outerClassName?: string,
  className?: string,
}

export const SectionBase = ({
  children,
  useDefaultStyle = true,
  backgroundColor = 'gray',
  outerClassName,
  className,
}: SectionBaseProps) => {
  return (
    <div className={tx('flex flex-col items-center w-full', {
      'bg-hw-grayscale-0': backgroundColor === 'white',
      'bg-hw-grayscale-50': backgroundColor === 'gray',
      'bg-hw-grayscale-1000': backgroundColor === 'black',
      'bg-hw-secondary-800': backgroundColor === 'darkSecondary',
      'bg-hw-primary-900': backgroundColor === 'darkPrimary',
      [apply('desktop:px-24 tablet:px-12 mobile:px-6 py-16')]: useDefaultStyle
    }, outerClassName)}>
      <div
        className={tx(
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
