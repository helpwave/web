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
import { Role } from '../components/OrganizationMemberList'
import { OrganizationDetail } from '../components/OrganizationDetails'

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

// TODO remove once backend is implemented
let organizations:OrganizationDTO[] = [
  {
    id: 'org1',
    shortName: 'UKM',
    longName: 'Uniklinkum Münster',
    email: 'ukm@helpwave.de',
    isVerified: false,
    wards: [{ name: 'ICU' }, { name: 'Radiology' }, { name: 'Cardiology' }],
    members: [
      {
        name: 'User1',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user1@helpwave.de',
        role: Role.admin
      }, {
        name: 'User2',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user2@helpwave.de',
        role: Role.user
      },
      {
        name: 'User3',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user3@helpwave.de',
        role: Role.user
      },
      {
        name: 'User4',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user4@helpwave.de',
        role: Role.user
      }
    ]
  },
  {
    id: 'org2',
    shortName: 'ORGA',
    longName: 'Organame',
    email: 'orga@helpwave.de',
    isVerified: false,
    wards: [{ name: 'ICU' }, { name: 'Radiology' }, { name: 'Cardiology' }],
    members: [
      {
        name: 'User1',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user1@helpwave.de',
        role: Role.admin
      }, {
        name: 'User2',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user2@helpwave.de',
        role: Role.user
      },
      {
        name: 'User3',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user3@helpwave.de',
        role: Role.user
      },
      {
        name: 'User4',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user4@helpwave.de',
        role: Role.user
      }
    ]
  },
]

const OrganizationPage: NextPage = ({ language }: PropsWithLanguage<OrganizationPageTranslation>) => {
  const queryClient = useQueryClient()

  const translation = useTranslation(language, defaultOrganizationPageTranslation)
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationDTO | undefined>(undefined)

  const router = useRouter()
  const { user, logout, accessToken } = useAuth(() => router.push({ pathname: '/login', query: { back: true } }))

  const queryKey = 'organizations'

  const createMutation = useMutation({
    mutationFn: async (organization) => {
      organization.id = Math.random().toString()
      // TODO create request for organization
      organizations = [...organizations, { ...organization, id: Math.random().toString() }]
      setSelectedOrganization(organization)
    },
    onMutate: async(organization: OrganizationDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousOrganizations = queryClient.getQueryData<OrganizationDTO[]>([queryKey])
      queryClient.setQueryData<OrganizationDTO[]>([queryKey], (old) => [...(old === undefined ? [] : old), organization])
      return { previousOrganizations }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousOrganizations)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (organization) => {
      // TODO create request for organization
      organizations = [...organizations.filter(value => value.id !== organization.id), organization]
      setSelectedOrganization(organization)
    },
    onMutate: async(organization: OrganizationDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousOrganizations = queryClient.getQueryData<OrganizationDTO[]>([queryKey])
      queryClient.setQueryData<OrganizationDTO[]>(
        [queryKey],
        (old) => [...(old === undefined ? [] : old.filter(value => value.id !== organization.id)), organization])
      return { previousOrganizations }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousOrganizations)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (organization) => {
      // TODO create request for organization
      organizations = [...organizations.filter(value => value.id !== organization.id)]
      setSelectedOrganization(undefined)
    },
    onMutate: async(organization: OrganizationDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousOrganizations = queryClient.getQueryData<OrganizationDTO[]>([queryKey])
      queryClient.setQueryData<OrganizationDTO[]>(
        [queryKey],
        (old) => [...(old === undefined ? [] : old.filter(value => value.id !== organization.id))])
      return { previousOrganizations }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousOrganizations)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      // TODO fetch user organizations
      return organizations
    },
  })

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
