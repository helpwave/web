import type { SelectProps } from '@helpwave/common/components/user_input/Select'
import { useMembersByOrganizationQuery } from '../mutations/organization_member_mutations'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { tx } from '@helpwave/common/twind'
import { SearchableSelect } from '@helpwave/common/components/user_input/SearchableSelect'
import type { OrgMember } from '../mutations/organization_mutations'

export type AssigneeSelectProps = Omit<SelectProps<OrgMember>, 'options'> & {
  organizationId: string
}

/**
 * A Select component for picking an assignee
 */
export const AssigneeSelect = ({
  organizationId,
  className,
  isHidingCurrentValue = false,
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
        options={(data ?? []).map(value => ({ value, label: value.name }))}
        isHidingCurrentValue={ isHidingCurrentValue}
        className={tx('w-full', className)}
        searchMapping={value => [value.value.id, value.value.email]}
        {...selectProps}
      />
    </LoadingAndErrorComponent>
  )
}
