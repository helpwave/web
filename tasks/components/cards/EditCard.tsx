import type { PropsWithChildren } from 'react'
import clsx from 'clsx'
import { Pencil } from 'lucide-react'

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
                           onEditClick,
                           className,
                         }: EditCardProps) => {
  return (
    <div
      className={clsx('card-md row w-full h-full gap-x-4 justify-between overflow-hidden', { 'pr-2': !!onEditClick }, className)}>
      {children}
      {onEditClick && (
        <button
          onClick={event => {
            event.stopPropagation()
            onEditClick()
          }}
          className={clsx('col justify-center items-center px-2 bg-gray-100 hover:bg-gray-200 rounded-md')}
        >
          <Pencil size={24}/>
        </button>
      )}
    </div>
  )
}
