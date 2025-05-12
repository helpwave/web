import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import type { TextButtonProps } from './Button'
import { TextButton } from './Button'
import type { TableSortingType } from './Table'

export type SortButtonProps = Omit<TextButtonProps, 'onClick'> & {
  ascending?: TableSortingType,
  onClick: (newTableSorting:TableSortingType) => void,
}

/**
 * A Extension of the normal button that displays the sorting state right of the content
 */
export const SortButton = ({
  children,
  ascending,
  color,
  onClick,
  ...buttonProps
}: SortButtonProps) => {
  return (
    <TextButton
      color={color}
      onClick={() => onClick(ascending === 'descending' ? 'ascending' : 'descending')}
      {...buttonProps}
    >
      <div className="row gap-x-2">
        {children}
        {ascending === 'ascending' ? <ChevronUp/> : (!ascending ? <ChevronsUpDown/> : <ChevronDown/>)}
      </div>
    </TextButton>
  )
}
