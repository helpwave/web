import type { SelectProps } from '@helpwave/common/components/user-input/Select'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { tx } from '@helpwave/common/twind'
import { SearchableSelect } from '@helpwave/common/components/user-input/SearchableSelect'
import { useMembersByOrganizationQuery } from '@/mutations/organization_member_mutations'

export type AssigneeSelectProps = Omit<SelectProps<string>, 'options'> & {
  organizationId: string
}

/**
 * A Select component for picking an assignee
 */
export const AssigneeSelect = ({
  value,
  organizationId,
  className,
  isHidingCurrentValue = false,
  onChange,
  ...selectProps
} : AssigneeSelectProps) => {
  const { data, isLoading, isError } = useMembersByOrganizationQuery(organizationId)

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
        className={tx('w-full', className)}
        searchMapping={value => [value.value.id, value.value.email]}
        onChange={(user) => {
          onChange(user.id)
        }}
        {...selectProps}
      />
    </LoadingAndErrorComponent>
  )
}
