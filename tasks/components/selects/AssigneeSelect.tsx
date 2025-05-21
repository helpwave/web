import type { SelectProps } from '@helpwave/hightide'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
import clsx from 'clsx'
import { SearchableSelect } from '@helpwave/hightide'
import { useMembersByOrganizationQuery } from '@helpwave/api-services/mutations/users/organization_member_mutations'

export type AssigneeSelectProps = Omit<SelectProps<string>, 'options'> & {
  organizationId: string,
}

/**
 * A Select component for picking an assignee
 */
export const AssigneeSelect = ({
  value,
  className,
  isHidingCurrentValue = false,
  onChange,
  ...selectProps
} : AssigneeSelectProps) => {
  const { data, isLoading, isError } = useMembersByOrganizationQuery()

  return (
    <LoadingAndErrorComponent
      isLoading={isLoading}
      hasError={isError}
    >
      <SearchableSelect
        // TODO update later with avatar of assignee
        value={data?.find(user => user.id === value)}
        options={(data ?? []).map(value => ({
          value,
          label: value.name
        }))}
        isHidingCurrentValue={isHidingCurrentValue}
        className={clsx('w-full', className)}
        searchMapping={value => [value.value.id, value.value.email]}
        onChange={(user) => {
          onChange(user.id)
        }}
        {...selectProps}
      />
    </LoadingAndErrorComponent>
  )
}
