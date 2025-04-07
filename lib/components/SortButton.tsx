import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import { tw } from '@helpwave/style-themes/twind'
import type { ButtonProps } from './Button'
import { SolidButton } from './Button'
import type { TableSortingType } from './Table'

export type SortButtonProps = Omit<ButtonProps, 'onClick'> & {
  ascending?: TableSortingType,
  onClick: (newTableSorting:TableSortingType) => void,
}

/**
 * A Extension of the normal button that displays the sorting state right of the content
 */
export const SortButton = ({
  children,
  ascending,
  color = 'none',
  variant = 'text',
  onClick,
  ...buttonProps
}: SortButtonProps) => {
  return (
    <SolidButton
      color={color}
      variant={variant}
      onClick={() => onClick(ascending === 'descending' ? 'ascending' : 'descending')}
      {...buttonProps}
    >
      <div className={tw('flex flex-row gap-x-2')}>
        {children}
        {ascending === 'ascending' ? <ChevronUp/> : (!ascending ? <ChevronsUpDown/> : <ChevronDown/>)}
      </div>
    </SolidButton>
  )
}
