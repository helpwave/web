import type { ReactNode } from 'react'
import { Tag } from 'lucide-react'
import { tx, tw } from '../twind'
import { noop } from '../util/noop'
import { Span } from './Span'
import { Button } from './Button'

export type DescriptionWithActionProps = {
  title: string,
  description: string,
  leadingIcon?: 'none' | 'label',
  trailing?: ReactNode,
  trailingButtonText?: string,
  trailingButtonFunction?: () => void,
  className?: string,
  titleClassName?: string,
  descriptionClassName?: string
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
      leading = <Tag className={tw('text-hw-primary-400')} size={16}/>
      break
    default:
      leading = null
      break
  }

  return (
    <div className={tx('rounded-lg bg-white flex flex-row gap-x-1 py-2 px-4', className)}>
      {leading && (
        <div className={tw('w-4 h-4 mt-[6px]')}>
          {leading}
        </div>
      )}
      <div className={tw('flex flex-col')}>
        <Span type="title" className={tx(titleClassName)}>{title}</Span>
        <Span type="description" className={tx(descriptionClassName)}>{description}</Span>
      </div>
      {trailing}
      {!trailing && trailingButtonText && (
        <div className={tw('flex flex-row items-center justify-end grow')}>
          <Button color="accent" onClick={trailingButtonFunction} className={tw('whitespace-nowrap')}>
            {trailingButtonText}
          </Button>
        </div>
      )}
    </div>
  )
}
