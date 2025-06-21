import type { PropsWithChildren } from 'react'
import clsx from 'clsx'
import { Pencil } from 'lucide-react'
import { IconButton } from '@helpwave/hightide'

export type EditCardProps = PropsWithChildren<{
  onClick?: () => void,
  onEditClick?: () => void,
  className?: string,
}>

/**
 * A Card with an editing button the right
 */
export const EditCard = ({
                           children,
                           onClick,
                           onEditClick,
                           className,
                         }: EditCardProps) => {
  return (
    <div
      className={clsx(
        'card-md row w-full h-full gap-x-4 justify-between overflow-hidden min-h-28',
        {
          'pr-2': !!onEditClick,
          'cursor-pointer': !!onClick,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
      {onEditClick && (
        <IconButton
          onClick={event => {
            event.stopPropagation()
            onEditClick()
          }}
          className="h-full justify-center items-center"
          color="neutral"
        >
          <Pencil size={24}/>
        </IconButton>
      )}
    </div>
  )
}
