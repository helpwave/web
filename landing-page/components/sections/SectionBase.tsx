import type { PropsWithChildren } from 'react'
import {clsx} from 'clsx'

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
    <div className={clsx('col items-center w-full', {
      'bg-white': backgroundColor === 'white',
      'bg-gray-50': backgroundColor === 'gray',
      'bg-black text-white': backgroundColor === 'black',
      'bg-[#11243e] text-white': backgroundColor === 'darkSecondary', // TODO make this a variable
      'bg-primary text-on-primary': backgroundColor === 'darkPrimary',
      'desktop:px-24 tablet:px-12 mobile:px-6 py-16': useDefaultStyle
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
