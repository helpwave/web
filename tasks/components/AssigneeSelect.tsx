import type { SelectProps } from '@helpwave/common/components/user_input/Select'
import { Select } from '@helpwave/common/components/user_input/Select'
import { useMembersByOrganizationQuery } from '../mutations/organization_member_mutations'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { tx } from '@helpwave/common/twind'

export type AssigneeSelectProps = Omit<SelectProps<string>, 'options'> & {
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
      <Select
        // TODO update later with avatar of assignee
        options={(data ?? []).map(value => ({ value: value.id, label: value.name }))}
        isHidingCurrentValue={ isHidingCurrentValue}
        className={tx('w-full', className)}
        {...selectProps}
      />
    </LoadingAndErrorComponent>
  )
}
