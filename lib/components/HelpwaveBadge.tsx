import { tx } from '@twind/core'
import { Helpwave } from '../icons/Helpwave'
import { Tile } from './layout/Tile'

type Size = 'small' | 'large'

export type HelpwaveBadgeProps = {
  size?: Size,
  className?: string
}

/**
 * A Badge with the helpwave logo and the helpwave name
 */
export const HelpwaveBadge = ({
  size = 'small',
  className = ''
}: HelpwaveBadgeProps) => {
  const iconSize: number = size === 'small' ? 24 : 64

  return (
    <Tile
      prefix={(<Helpwave size={iconSize}/>)}
      title={{ value: 'helpwave', type: 'title', className: size === 'small' ? '!text-base' : '!text-3xl' }}
      className={tx('text-white',
        {
          'px-2 py-1 rounded-md': size === 'small',
          'px-4 py-1 rounded-md': size === 'large',
        }, className)}
    />
  )
}
