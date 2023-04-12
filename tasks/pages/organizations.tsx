import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../components/layout/TwoColumn'
import { OrganizationDisplay } from '../components/layout/OrganizationDisplay'
import type { Role } from '../components/OrganizationMemberList'
import { OrganizationDetail } from '../components/layout/OrganizationDetails'
import {
  useCreateMutation,
  useDeleteMutation,
  useOrganizationQuery,
  useUpdateMutation
} from '../mutations/organization_mutations'
import { PageWithHeader } from '../components/layout/PageWithHeader'

type OrganizationsPageTranslation = {
  organizations: string
}

const defaultOrganizationsPageTranslation = {
  de: {
    organizations: 'Organisationen'
  },
  en: {
    organizations: 'Organizations'
  }
}

type WardDTO = {
  name: string
}

type OrgMember = {
  email: string,
  name: string,
  avatarURL: string,
  role: Role
}

type OrganizationDTO = {
  id: string,
  shortName: string,
  longName: string,
  email: string,
  isVerified: boolean,
  wards: WardDTO[],
  members: OrgMember[]
}

const OrganizationsPage: NextPage = ({ language }: PropsWithLanguage<OrganizationsPageTranslation>) => {
  const translation = useTranslation(language, defaultOrganizationsPageTranslation)
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationDTO | undefined>(undefined)

  const createMutation = useCreateMutation(setSelectedOrganization)
  const updateMutation = useUpdateMutation(setSelectedOrganization)
  const deleteMutation = useDeleteMutation(setSelectedOrganization)
  const { isLoading, isError, data } = useOrganizationQuery()

  // TODO add view for loading
  if (isLoading) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError) {
    return <div>Error Message</div>
  }

  return (
    <PageWithHeader
      crumbs={[{ display: translation.organizations, link: '/organizations' }]}
    >
      <Head>
        <title>{translation.organizations}</title>
      </Head>
      <TwoColumn
        left={(
          <OrganizationDisplay
            selectedOrganization={selectedOrganization}
            organizations={data as OrganizationDTO[]}
            onSelectionChange={setSelectedOrganization}
          />
        )}
        right={(
          <OrganizationDetail
            key={selectedOrganization === undefined ? 'unselected' : selectedOrganization.id}
            organization={selectedOrganization}
            onCreate={createMutation.mutate}
            onUpdate={updateMutation.mutate}
            onDelete={deleteMutation.mutate}
          />
        )}
      />
    </PageWithHeader>
  )
}

export default OrganizationsPage
