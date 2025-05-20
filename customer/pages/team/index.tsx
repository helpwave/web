import type { NextPage } from 'next'
import type { Languages } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { Section } from '@/components/layout/Section'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
import type { UserRole, UserRoleTranslation, UserSeat } from '@/api/dataclasses/user_seat'
import { userRoles } from '@/api/dataclasses/user_seat'
import { defaultUserRoleTranslation } from '@/api/dataclasses/user_seat'
import { useUserSeatsQuery, useUserSeatUpdateMutation } from '@/api/mutations/user_seat_mutations'
import { Table } from '@helpwave/hightide'
import { Select } from '@helpwave/hightide'
import { Checkbox } from '@helpwave/hightide'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'

type TeamTranslation = {
  team: string,
  teamDescription: string,
  role : string,
  enabled: string,
} & UserRoleTranslation

const defaultTeamTranslations: Record<Languages, TeamTranslation> = {
  en: {
    ...defaultUserRoleTranslation.en,
    team: 'Team',
    teamDescription: 'Here you can change and add members to your team.',
    role: 'Role',
    enabled: 'Enabled',
  },
  de: {
    ...defaultUserRoleTranslation.de,
    team: 'Team',
    teamDescription: 'Hier kannst du Mitglieder deines Teams verwalten.',
    role: 'Rolle',
    enabled: 'Aktiv',
  }
}

type TeamServerSideProps = {
  jsonFeed: unknown,
}

const Team: NextPage<PropsForTranslation<TeamTranslation, TeamServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultTeamTranslations, overwriteTranslation)
  const { data, isError, isLoading } = useUserSeatsQuery()
  const userSeatUpdate = useUserSeatUpdateMutation()

  const idMapping = (value: UserSeat): string => value.customerUUID + value.email

  // TODO do input validation
  return (
    <Page pageTitle={titleWrapper(translation.team)} mainContainerClassName="min-h-[auto] pb-6">
      <Section titleText={translation.team}>
        <LoadingAndErrorComponent isLoading={isLoading} hasError={isError} minimumLoadingDuration={200}>
          {!!data && (
            <div className="col gap-y-1">
              <span>{translation.teamDescription}</span>
              <Table
                data={data}
                identifierMapping={idMapping}
                header={[
                  (<span key="user">{translation.user}</span>),
                  (<span key="role">{translation.role}</span>),
                  (<span key="enabled">{translation.enabled}</span>)
                ]}
                rowMappingToCells={dataObject => [
                  (
                    <div key={idMapping(dataObject) + '-name'} className="col">
                      <span
                        className="text-lg font-semibold">{`${dataObject.firstName} ${dataObject.lastName}`}</span>
                      <span className="text-gray-400">{dataObject.email}</span>
                    </div>
                  ),
                  (
                    <Select<UserRole>
                      key={idMapping(dataObject) + '-role'}
                      value={dataObject.role}
                      options={userRoles.map(role => ({ value: role, label: translation[role] }))}
                      onChange={role => userSeatUpdate.mutate({ ...dataObject, role })}
                    />
                  ),
                  (
                    <Checkbox
                      key={idMapping(dataObject) + '-enabled'}
                      checked={dataObject.enabled}
                      onChange={enabled => userSeatUpdate.mutate({ ...dataObject, enabled })}
                    />
                  )
                ]}
              />
            </div>
          )}
        </LoadingAndErrorComponent>
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(Team))
