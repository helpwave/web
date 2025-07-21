import type { SelectProps } from '@helpwave/hightide'
import { Avatar, LoadingAndErrorComponent, Select } from '@helpwave/hightide'
import clsx from 'clsx'
import { useMembersByOrganizationQuery } from '@helpwave/api-services/mutations/users/organization_member_mutations'
import type { OrganizationMember } from '@helpwave/api-services/types/users/organization_member'

export type AssigneeSelectProps = Omit<SelectProps<OrganizationMember>, 'options' | 'value'> & {
  value?: string,
}

/**
 * A Select component for picking an assignee
 */
export const AssigneeSelect = ({
                                 value,
                                 className,
                                 onChange,
                                 ...selectProps
                               }: AssigneeSelectProps) => {
  const { data, isLoading, isError } = useMembersByOrganizationQuery()

  return (
    <LoadingAndErrorComponent
      isLoading={isLoading}
      hasError={isError}
      className="min-h-10 w-full"
    >
      <Select
        value={data?.find(user => user.userId === value)}
        options={(data ?? []).map(value => ({
          value,
          label: (
            <div className="row items-center gap-x-1">
              <Avatar
                image={value.avatarURL ? { avatarUrl: value.avatarURL, alt: '' } : undefined} name={value.nickname} size="md"
                fullyRounded={true}
              />
              {value.nickname}
            </div>
          ),
          searchTags: [value.nickname, value.email],
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
