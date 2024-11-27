import type { SelectProps } from '@helpwave/common/components/user-input/Select'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { tx } from '@helpwave/common/twind'
import { SearchableSelect } from '@helpwave/common/components/user-input/SearchableSelect'
import { useMembersByOrganizationQuery } from '@helpwave/api-services/mutations/users/organization_member_mutations'
import { useEffect } from 'react'
import { noop } from '@helpwave/common/util/noop'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'

export type AssigneeSelectProps = Omit<SelectProps<string>, 'options'> & {
  organizationId: string
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
  const { organization } = useAuth()
  // TODO fix that the organization matches the selected organization
  const { data, isLoading, isError } = useMembersByOrganizationQuery(organization?.id)

  useEffect(noop, [value, data])

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
