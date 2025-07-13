import type { SelectProps } from '@helpwave/hightide'
import { Avatar } from '@helpwave/hightide'
import { Select } from '@helpwave/hightide'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
import clsx from 'clsx'
import { useMembersByOrganizationQuery } from '@helpwave/api-services/mutations/users/organization_member_mutations'
import type { OrganizationMember } from '@helpwave/api-services/types/users/organization_member'

export type AssigneeSelectProps = Omit<SelectProps<OrganizationMember>, 'options'> & {
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
      loadingProps={{
        loadingText: '',
        classname: 'bg-gray-100 pulsing max-h-8 rounded-md',
      }}
    >
      <Select
        value={data?.find(user => user.id === value?.id)}
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
