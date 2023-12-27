import type { PropsWithChildren } from 'react'
import { tw, tx } from '@helpwave/common/twind'
import { Card, type CardProps } from '@helpwave/common/components/Card'
import { Pencil } from 'lucide-react'

export type EditCardProps = PropsWithChildren<CardProps & {
  onEditClick?: () => void
}>

/**
 * A Card with a editing button the right
 */
export const EditCard = ({
  children,
  onEditClick,
  className,
  ...cardProps
}: EditCardProps) => {
  return (
    <Card className={tx('w-full', { 'pr-2': !!onEditClick }, className)} {...cardProps}>
      <div className={tw('flex flex-row gap-x-4 justify-between overflow-hidden h-full')}>
        {children}
        {onEditClick && (
          <button
            onClick={event => {
              event.stopPropagation()
              onEditClick()
            }}
            className={tx('flex flex-col justify-center items-center px-2 bg-gray-100 hover:bg-gray-200 rounded-md')}
          >
            <Pencil size={24}/>
          </button>
        )}
      </div>
    </Card>
  )
}
