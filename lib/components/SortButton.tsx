import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import { tw } from '../twind'
import type { ButtonProps } from './Button'
import { Button } from './Button'
import type { TableSortingType } from './Table'

export type SortButtonProps = Omit<ButtonProps, 'onClick'> & {
  ascending?: TableSortingType,
  onClick: (newTableSorting:TableSortingType) => void
}

/**
 * A Extension of the normal button that displays the sorting state right of the content
 */
export const SortButton = ({
  children,
  ascending,
  color = 'none',
  variant = 'textButton',
  onClick,
  ...buttonProps
}: SortButtonProps) => {
  return (
    <Button
      color={color}
      variant={variant}
      onClick={() => onClick(ascending === 'descending' ? 'ascending' : 'descending')}
      {...buttonProps}
    >
      <div className={tw('flex flex-row gap-x-2')}>
        {children}
        {ascending === 'ascending' ? <ChevronUp/> : (!ascending ? <ChevronsUpDown/> : <ChevronDown/>)}
      </div>
    </Button>
  )
}
