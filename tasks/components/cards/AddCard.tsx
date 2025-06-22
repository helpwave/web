import clsx from 'clsx'
import { Plus } from 'lucide-react'

export type AddCardProps = {
  onClick?: () => void,
  text?: string,
  isSelected?: boolean,
  className?: string,
}

/**
 * A Card for adding something the text shown is configurable
 */
export const AddCard = ({
                          onClick,
                          text,
                          isSelected = false,
                          className,
                        }: AddCardProps) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'card-md row justify-center items-center gap-x-1 text-gray-400 border-2 hover:border-primary h-full hover:brightness-[98%] min-h-28',
        { 'cursor-pointer': !!onClick },
        {
          'border-primary': isSelected,
          'border-transparent': !isSelected
        },
        className
      )}
    >
      <Plus/>
      {text && <span>{text}</span>}
    </div>
  )
}
