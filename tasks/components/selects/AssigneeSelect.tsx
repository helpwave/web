import type { SelectProps } from '@helpwave/hightide'
import { Avatar } from '@helpwave/hightide'
import { Select } from '@helpwave/hightide'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
import clsx from 'clsx'
import { useMembersByOrganizationQuery } from '@helpwave/api-services/mutations/users/organization_member_mutations'
import type { OrganizationMember } from '@helpwave/api-services/types/users/organization_member'

export type AssigneeSelectProps = Omit<SelectProps<OrganizationMember>, 'options' | 'value'> & {
  value?: string,
  organizationId: string,
}

/**
 * A Select component for picking an assignee
 */
export const AssigneeSelect = ({
  organizationId,
  value,
  className,
  onChange,
  ...selectProps
} : AssigneeSelectProps) => {
  const { data, isLoading, isError } = useMembersByOrganizationQuery(organizationId)

  return (
    <LoadingAndErrorComponent
      isLoading={isLoading}
      hasError={isError}
      className="min-h-10 w-full"
      minimumLoadingDuration={200}
    >
      <Select
        value={data?.find(user => user.id === value)}
        options={(data ?? []).map(value => ({
          value,
          label: (
            <div className="row items-center gap-x-1">
              <Avatar alt="" avatarUrl={value.avatarURL} size="tiny"/>
              {value.name}
            </div>
          ),
          searchTags: [value.name, value.email],
        }))}
        className={clsx('w-full', className)}
        onChange={(user) => {
          onChange(user)
        }}
        {...selectProps}
      />
    </LoadingAndErrorComponent>
  )
}
