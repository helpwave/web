import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { tw } from '@helpwave/common/twind/index'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { Header } from '../components/Header'
import { UserMenu } from '../components/UserMenu'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../components/TwoColumn'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { OrganizationDisplay } from '../components/OrganizationDisplay'
import type { Role } from '../components/OrganizationMemberList'
import { OrganizationDetail } from '../components/OrganizationDetails'
import { getCreateMutation, getDeleteMutation, getQuery, getUpdateMutation } from '../mutations/organization_mutations'

type OrganizationPageTranslation = {
  organizations: string
}

const defaultOrganizationPageTranslation = {
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

const OrganizationPage: NextPage = ({ language }: PropsWithLanguage<OrganizationPageTranslation>) => {
  const queryClient = useQueryClient()

  const translation = useTranslation(language, defaultOrganizationPageTranslation)
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationDTO | undefined>(undefined)

  const router = useRouter()
  const { user, logout, accessToken } = useAuth(() => router.push({ pathname: '/login', query: { back: true } }))

  const createMutation = useMutation(getCreateMutation(queryClient, setSelectedOrganization))

  const updateMutation = useMutation(getUpdateMutation(queryClient, setSelectedOrganization))

  const deleteMutation = useMutation(getDeleteMutation(queryClient, setSelectedOrganization))

  const { isLoading, isError, data, error } = useQuery(getQuery())

  if (!user) return null

  // TODO add view for loading
  if (isLoading) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError) {
    return <div>Error Message</div>
  }

  return (
    <div className={tw('w-screen h-screen flex flex-col')}>
      <Head>
        <title>{translation.organizations}</title>
      </Head>

      <Header
        title="helpwave"
        navigation={[
          { text: 'Dashboard', href: '/' },
          { text: 'Contact', href: '/contact' },
        ]}
        actions={[<UserMenu key="user-menu" user={user}/>]}
      />
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
            key={selectedOrganization === undefined ? 'undefined' : selectedOrganization.longName}
            organization={selectedOrganization}
            onCreate={createMutation.mutate}
            onUpdate={updateMutation.mutate}
            onDelete={deleteMutation.mutate}
          />
        )}
      />
    </div>
  )
}

export default OrganizationPage
