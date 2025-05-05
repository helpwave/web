import type { ReactNode } from 'react'
import { Tag } from 'lucide-react'
import clsx from 'clsx'
import { noop } from '../util/noop'
import { SolidButton } from './Button'

export type DescriptionWithActionProps = {
  title: string,
  description: string,
  leadingIcon?: 'none' | 'label',
  trailing?: ReactNode,
  trailingButtonText?: string,
  trailingButtonFunction?: () => void,
  className?: string,
  titleClassName?: string,
  descriptionClassName?: string,
}

/**
 * A component for aligning a title, description and leading, trailing components uniformly
 */
export const DescriptionWithAction = ({
  title = '',
  description = '',
  leadingIcon = 'none',
  trailing,
  trailingButtonText = '',
  trailingButtonFunction = noop,
  className = '',
  titleClassName = '',
  descriptionClassName = ''
}: DescriptionWithActionProps) => {
  let leading
  switch (leadingIcon) {
  case 'label':
    leading = <Tag className={clsx('text-primary')} size={16}/>
    break
  default:
    leading = null
    break
  }

  return (
    <div className={clsx('col gap-y-1 desktop:row desktop:gap-x-1 rounded-lg bg-white py-2 px-4', className)}>
      {leading && (
        <div className={clsx('w-4 h-4 mt-[6px]')}>
          {leading}
        </div>
      )}
      <div className={clsx('col')}>
        <span className={clsx('textstyle-description', titleClassName)}>{title}</span>
        <span className={clsx('textstyle-description', descriptionClassName)}>{description}</span>
      </div>
      {trailing}
      {!trailing && trailingButtonText && (
        <div className={clsx('row items-center justify-center desktop:justify-end grow')}>
          <SolidButton onClick={trailingButtonFunction} className={clsx('whitespace-nowrap')}>
            {trailingButtonText}
          </SolidButton>
        </div>
      )}
    </div>
  )
}
