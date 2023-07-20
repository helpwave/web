import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useContext, useEffect, useState } from 'react'
import type { OrganizationFormType } from '../OrganizationForm'
import { emptyOrganizationForm, OrganizationForm } from '../OrganizationForm'
import { OrganizationMemberList } from '../OrganizationMemberList'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Span } from '@helpwave/common/components/Span'
import {
  useOrganizationCreateMutation, useOrganizationDeleteMutation,
  useOrganizationQuery, useOrganizationUpdateMutation
} from '../../mutations/organization_mutations'
import { OrganizationContext } from '../../pages/organizations'
import type { OrganisationInvitation } from '../OrganisationInvitationList'
import { OrganisationInvitationList } from '../OrganisationInvitationList'

type OrganizationDetailTranslation = {
  organizationDetail: string,
  dangerZone: string,
  dangerZoneText: string,
  deleteConfirmText: string,
  deleteOrganization: string,
  create: string,
  update: string
}

const defaultOrganizationDetailTranslations: Record<Languages, OrganizationDetailTranslation> = {
  en: {
    organizationDetail: 'Organization Details',
    dangerZone: 'Danger Zone',
    dangerZoneText: 'Deleting the organization is a permanent action and cannot be undone. Be careful!',
    deleteConfirmText: 'Do you really want to delete this organization?',
    deleteOrganization: 'Delete Organization',
    create: 'Create',
    update: 'Update'
  },
  de: {
    organizationDetail: 'Organisations Details',
    dangerZone: 'Gefahren Zone',
    dangerZoneText: 'Das Löschen einer Organisation ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!',
    deleteConfirmText: 'Wollen Sie wirklich diese Organisation löschen?',
    deleteOrganization: 'Organisation löschen',
    create: 'Erstellen',
    update: 'Ändern'
  }
}

export type OrganizationDetailProps = {
  width?: number
}

/**
 * The left side of the organizations page
 */
export const OrganizationDetail = ({
  language
}: PropsWithLanguage<OrganizationDetailTranslation, OrganizationDetailProps>) => {
  const translation = useTranslation(language, defaultOrganizationDetailTranslations)

  const {
    state: contextState,
    updateContext
  } = useContext(OrganizationContext)

  const isCreatingNewOrganization = contextState.organizationID === ''
  const { data } = useOrganizationQuery(contextState.organizationID)
  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)
  const [organizationForm, setOrganizationForm] = useState<OrganizationFormType>(emptyOrganizationForm)
  const [organizationInvites, setOrganizationInvites] = useState<OrganisationInvitation[]>([])

  useEffect(() => {
    if (data && !isCreatingNewOrganization) {
      setOrganizationForm({
        isValid: true,
        hasChanges: false,
        organization: {
          ...data,
          members: []
        }
      })
    }
  }, [data, isCreatingNewOrganization])

  const createMutation = useOrganizationCreateMutation(organization => {
    // TODO invite members
    updateContext({ organizationID: organization.id })
  })

  const updateMutation = useOrganizationUpdateMutation(organization => {
    setOrganizationForm({
      isValid: true,
      hasChanges: false,
      organization: {
        ...organization,
        members: []
      }
    })
  })

  const deleteMutation = useOrganizationDeleteMutation(() => updateContext({
    organizationID: ''
  }))

  return (
  <div className={tw('flex flex-col py-4 px-6')}>
    <ConfirmDialog
      title={translation.deleteConfirmText}
      description={translation.dangerZoneText}
      isOpen={isShowingConfirmDialog}
      onCancel={() => setIsShowingConfirmDialog(false)}
      onBackgroundClick={() => setIsShowingConfirmDialog(false)}
      onConfirm={() => {
        setIsShowingConfirmDialog(false)
        deleteMutation.mutate(contextState.organizationID)
      }}
      confirmType="negative"
    />
    <ColumnTitle title={translation.organizationDetail}/>
    <div className={tw('flex flex-col gap-y-4 max-w-[500px]')}>
      <OrganizationForm
        organizationForm={organizationForm}
        isShowingErrorsDirectly={!isCreatingNewOrganization}
        onChange={organizationForm => {
          if (isCreatingNewOrganization) {
            setOrganizationForm(organizationForm)
          } else {
            updateMutation.mutate(organizationForm.organization)
          }
        }}
      />
      {!isCreatingNewOrganization && (
        // TODO updatae later
        <OrganizationMemberList
          organizationID={organizationForm.organization.id}
          members={organizationForm.organization.members}
          onChange={() => undefined}
        />
      )}
      <OrganisationInvitationList
        onChange={setOrganizationInvites}
        invitations={organizationInvites}
        organizationID={contextState.organizationID}
      />
      <div className={tw('flex flex-row justify-end')}>
        <Button
          className={tw('w-auto')}
          onClick={() => isCreatingNewOrganization ? createMutation.mutate(organizationForm.organization) : updateMutation.mutate(organizationForm.organization)}
          disabled={!organizationForm.isValid}>
          {isCreatingNewOrganization ? translation.create : translation.update}
        </Button>
      </div>
      <div className={tx('flex flex-col justify-start', { hidden: isCreatingNewOrganization })}>
        <Span type="subsectionTitle">{translation.dangerZone}</Span>
        <Span type="description">{translation.dangerZoneText}</Span>
        <button
          onClick={() => setIsShowingConfirmDialog(true)}
          className={tw('text-hw-negative-400 font-bold text-left')}
        >
          {translation.deleteOrganization}
        </button>
      </div>
    </div>
  </div>
  )
}
