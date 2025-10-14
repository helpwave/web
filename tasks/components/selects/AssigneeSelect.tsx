import type { SelectProps } from '@helpwave/hightide'
import { Avatar, LoadingAndErrorComponent, Select, SelectOption } from '@helpwave/hightide'
import { useMembersByOrganizationQuery } from '@helpwave/api-services/mutations/users/organization_member_mutations'
import type { OrganizationMember } from '@helpwave/api-services/types/users/organization_member'
import clsx from 'clsx'

export type AssigneeSelectProps = Omit<SelectProps, 'onValueChanged' | 'children'> & {
  value?: string,
  onValueChanged?: (user: OrganizationMember) => void,
}

/**
 * A Select component for picking an assignee
 */
export const AssigneeSelect = ({
                                 value,
                                 onValueChanged,
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
        {...selectProps}
        value={value}
        onValueChanged={(id: string) => {
          const user = data?.find(user => user.userId === id)
          if (user) {
            onValueChanged?.(user)
          }
        }}
        buttonProps={{
          ...selectProps?.buttonProps,
          className: clsx('w-full', selectProps?.buttonProps?.className),
          selectedDisplay: (id: string) => {
            const user = data?.find(user => user.userId === id)
            if (user) {
              return (
                <div className="row items-center gap-x-1">
                  <Avatar
                    image={user.avatarURL ? { avatarUrl: user.avatarURL, alt: '' } : undefined} name={user.nickname}
                    size="md"
                    fullyRounded={true}
                  />
                  {user.nickname}
                </div>
              )
            }
            return '-'
          }
        }}
      >
        {(data ?? []).map(value => (
          <SelectOption key={value.userId} value={value.userId}>
            <div className="row items-center gap-x-1">
              <Avatar
                image={value.avatarURL ? { avatarUrl: value.avatarURL, alt: '' } : undefined} name={value.nickname}
                size="md"
                fullyRounded={true}
              />
              {value.nickname}
            </div>
          </SelectOption>
        ))}
      </Select>
    </LoadingAndErrorComponent>
  )
}
