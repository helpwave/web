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
import titleWrapper from '../utils/titleWrapper'
import { DiscardChangesDialog } from '@helpwave/common/components/modals/DiscardChangesDialog'

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

export type OrganizationFormType = {
  isValid: boolean,
  hasChanges: boolean,
  organization: OrganizationDTO
}

type DiscardChangesInfo = {
  isShowing: boolean,
  organization: OrganizationDTO | undefined
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

export type OrganizationDTO = {
  id: string,
  shortName: string,
  longName: string,
  email: string,
  isVerified: boolean,
  wards: WardDTO[],
  members: OrgMember[]
}

export const emptyOrganization: OrganizationDTO = {
  id: '',
  shortName: '',
  longName: '',
  email: '',
  isVerified: false,
  wards: [],
  members: []
}

const OrganizationsPage: NextPage = ({ language }: PropsWithLanguage<OrganizationsPageTranslation>) => {
  const translation = useTranslation(language, defaultOrganizationsPageTranslation)
  const [discardDialogInfo, setDiscardDialogInfo] = useState<DiscardChangesInfo>({
    isShowing: false,
    organization: emptyOrganization
  })

  const [organizationForm, setOrganizationForm] = useState<OrganizationFormType>({
    isValid: false,
    hasChanges: false,
    organization: emptyOrganization
  })
  const createMutation = useCreateMutation(organization => {
    setOrganizationForm({
      isValid: true,
      hasChanges: false,
      organization: discardDialogInfo.organization !== undefined ? discardDialogInfo.organization : organization ?? emptyOrganization
    })
    setDiscardDialogInfo({ isShowing: false, organization: undefined })
  })
  const updateMutation = useUpdateMutation(organization => {
    setOrganizationForm({
      isValid: true,
      hasChanges: false,
      organization: discardDialogInfo.organization !== undefined ? discardDialogInfo.organization : organization ?? emptyOrganization
    })
    setDiscardDialogInfo({ isShowing: false, organization: undefined })
  })
  const deleteMutation = useDeleteMutation(() => {
    setOrganizationForm({
      isValid: false,
      hasChanges: false,
      organization: emptyOrganization
    })
    setDiscardDialogInfo({ isShowing: false, organization: undefined })
  })
  const { isLoading, isError, data } = useOrganizationQuery()

  const changeOrganization = (organization: OrganizationDTO) => {
    if (organizationForm.organization.id === '' && !organizationForm.hasChanges) {
      setOrganizationForm({
        isValid: organization !== undefined,
        hasChanges: false,
        organization: organization ?? emptyOrganization
      })
      return
    }
    // Same ID don't change anything
    if (organizationForm.organization.id === organization?.id) return

    if (organizationForm.hasChanges) {
      setDiscardDialogInfo({ isShowing: true, organization })
    } else {
      setOrganizationForm({
        isValid: organization !== undefined,
        hasChanges: false,
        organization: organization ?? emptyOrganization
      })
    }
  }

  const onSave = () => {
    if (!organizationForm.isValid) {
      setDiscardDialogInfo({ isShowing: false, organization: undefined })
    } else {
      if (organizationForm.organization.id === '') {
        createMutation.mutate(organizationForm.organization)
      } else {
        updateMutation.mutate(organizationForm.organization)
      }
      setOrganizationForm({
        isValid: discardDialogInfo.organization !== undefined && discardDialogInfo.organization?.id !== '',
        hasChanges: false,
        organization: discardDialogInfo.organization ?? emptyOrganization
      })
    }
  }

  const onDontSave = () => {
    setOrganizationForm({
      isValid: discardDialogInfo.organization !== undefined && discardDialogInfo.organization?.id !== '',
      hasChanges: false,
      organization: discardDialogInfo.organization ?? emptyOrganization
    })
    setDiscardDialogInfo({ isShowing: false, organization: undefined })
  }

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
        <title>{titleWrapper(translation.organizations)}</title>
      </Head>
      <DiscardChangesDialog
        isOpen={discardDialogInfo.isShowing}
        onCancel={() => {
          setDiscardDialogInfo({ isShowing: false, organization: undefined })
        }}
        onDontSave={onDontSave}
        onSave={onSave}
      />
      <TwoColumn
        left={() => (
          <OrganizationDisplay
            selectedOrganization={organizationForm.organization}
            organizations={data as OrganizationDTO[]}
            onSelectionChange={changeOrganization}
          />
        )}
        right={() => (
          <OrganizationDetail
            key={organizationForm.organization.id}
            organizationForm={organizationForm}
            onCreate={createMutation.mutate}
            onUpdate={updateMutation.mutate}
            onDelete={deleteMutation.mutate}
            setOrganization={setOrganizationForm}
          />
        )}
      />
    </PageWithHeader>
  )
}

export default OrganizationsPage
