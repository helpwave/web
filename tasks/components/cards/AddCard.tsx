import clsx from 'clsx'
import { Plus } from 'lucide-react'

export type AddCardProps = {
  onClick?: () => void,
  text?: string,
  className?: string,
}

/**
 * A Card for adding something the text shown is configurable
 */
export const AddCard = ({
                          onClick,
                          text,
                          className,
                        }: AddCardProps) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'card-md row justify-center items-center gap-x-1 text-gray-400 border-gray-400 h-full border-2 border-dashed hover:brightness-95 min-h-28',
        { 'cursor-pointer': !!onClick },
        className
      )}
    >
      <Plus/>
      {text && <span>{text}</span>}
    </div>
  )
}
