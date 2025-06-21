import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import { ConfirmModal } from '@helpwave/hightide'
import { type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import { useContext, useEffect, useState } from 'react'
import { SolidButton } from '@helpwave/hightide'
import {
  useInviteMemberMutation,
  useOrganizationCreateMutation,
  useOrganizationDeleteMutation,
  useOrganizationQuery,
  useOrganizationUpdateMutation
} from '@helpwave/api-services/mutations/users/organization_mutations'
import type { OrganizationMinimalDTO } from '@helpwave/api-services/types/users/organizations'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { emptyOrganizationForm, OrganizationForm, type OrganizationFormType } from '../OrganizationForm'
import { OrganizationMemberList } from '../OrganizationMemberList'
import { ColumnTitle } from '../ColumnTitle'
import { type OrganizationInvitation, OrganizationInvitationList } from '../OrganizationInvitationList'
import { OrganizationContext } from '@/pages/organizations'
import { ReSignInDialog } from '@/components/modals/ReSignInDialog'

type OrganizationDetailTranslation = {
  organizationDetail: string,
  dangerZone: string,
  dangerZoneText: string,
  deleteConfirmText: string,
  deleteOrganization: string,
  create: string,
  update: string,
}

const defaultOrganizationDetailTranslations: Translation<OrganizationDetailTranslation> = {
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
    dangerZone: 'Risikobereich',
    dangerZoneText: 'Das Löschen einer Organisation ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!',
    deleteConfirmText: 'Wollen Sie wirklich diese Organisation löschen?',
    deleteOrganization: 'Organisation löschen',
    create: 'Erstellen',
    update: 'Ändern'
  }
}

export type OrganizationDetailProps = {
  width?: number,
}

/**
 * The left side of the organizations page
 */
export const OrganizationDetail = ({
  overwriteTranslation
}: PropsForTranslation<OrganizationDetailTranslation, OrganizationDetailProps>) => {
  const translation = useTranslation(defaultOrganizationDetailTranslations, overwriteTranslation)

  const {
    state: contextState,
    updateContext
  } = useContext(OrganizationContext)

  const { signOut } = useAuth()
  const isCreatingNewOrganization = contextState.organizationId === ''
  const { data } = useOrganizationQuery(contextState.organizationId)
  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)
  const [isShowingReSignInDialog, setIsShowingReSignInDialog] = useState<string>()
  const [organizationForm, setOrganizationForm] = useState<OrganizationFormType>(emptyOrganizationForm)
  const [organizationInvites, setOrganizationInvites] = useState<OrganizationInvitation[]>([])

  const resetForm = () => {
    setOrganizationForm(emptyOrganizationForm)
    setOrganizationInvites([])
  }

  useEffect(() => {
    if (data && !isCreatingNewOrganization) {
      setOrganizationForm({
        isValid: true,
        hasChanges: false,
        organization: { ...data },
        touched: {
          shortName: false,
          longName: false,
          email: false
        }
      })
    }
  }, [data, isCreatingNewOrganization])

  const inviteMemberMutation = useInviteMemberMutation(contextState.organizationId)

  const createOrganizationMutation = useOrganizationCreateMutation()
  const updateOrganizationMutation = useOrganizationUpdateMutation()
  const deleteOrganizationMutation = useOrganizationDeleteMutation()

  const createOrganization = (organization: OrganizationMinimalDTO) => createOrganizationMutation.mutateAsync(organization)
    .then((organization) => {
      organizationInvites.forEach(invite => inviteMemberMutation.mutate({
        email: invite.email,
        organizationId: organization.id
      }))
      setIsShowingReSignInDialog(organization.id)
    })

  const updateOrganization = (organization: OrganizationMinimalDTO) => updateOrganizationMutation.mutateAsync(organization)
    .then((organization) => {
      setOrganizationForm({
        isValid: true,
        hasChanges: false,
        organization: {
          ...organization
        },
        touched: organizationForm.touched
      })
    })

  const deleteOrganization = (organizationId: string) => deleteOrganizationMutation.mutateAsync(organizationId)
    .then(() => {
      updateContext({
        organizationId: '' // TODO: bad!
      })
    })

  return (
    <div
      key={contextState.organizationId}
      className="col py-4 px-6"
    >
      <ConfirmModal
        headerProps={{
          titleText: translation.deleteConfirmText,
          descriptionText: translation.dangerZoneText,
        }}
        isOpen={isShowingConfirmDialog}
        onCancel={() => setIsShowingConfirmDialog(false)}
        onConfirm={() => {
          setIsShowingConfirmDialog(false)
          deleteOrganization(contextState.organizationId).catch(console.error)
        }}
        confirmType="negative"
      />
      <ReSignInDialog
        isOpen={!!isShowingReSignInDialog}
        onDecline={() => {
          setIsShowingReSignInDialog(undefined)
          resetForm()
        }}
        onConfirm={() => {
          if (isShowingReSignInDialog) {
            updateContext({ organizationId: isShowingReSignInDialog })
          }
          setIsShowingReSignInDialog(undefined)
          signOut()
        }}
      />
      <ColumnTitle title={translation.organizationDetail}/>
      <div className="col gap-y-8 max-w-[500px]">
        <OrganizationForm
          organizationForm={organizationForm}
          onChange={(organizationForm, shouldUpdate) => {
            setOrganizationForm(organizationForm)
            if (shouldUpdate) {
              updateOrganization(organizationForm.organization).catch(console.error)
            }
          }}
        />
        {!isCreatingNewOrganization && (
          <OrganizationMemberList/>
        )}
        <OrganizationInvitationList
          onChange={setOrganizationInvites}
          invitations={isCreatingNewOrganization ? organizationInvites : undefined}
          organizationId={contextState.organizationId}
        />
        <div className="row justify-end">
          <SolidButton
            className="w-auto"
            onClick={() => isCreatingNewOrganization ? createOrganization(organizationForm.organization) : updateOrganization(organizationForm.organization)}
            disabled={!organizationForm.isValid}>
            {isCreatingNewOrganization ? translation.create : translation.update}
          </SolidButton>
        </div>
        <div className={clsx('col justify-start', { hidden: isCreatingNewOrganization })}>
          <span className="textstyle-title-normal">{translation.dangerZone}</span>
          <span className="textstyle-description">{translation.dangerZoneText}</span>
          <button
            onClick={() => setIsShowingConfirmDialog(true)}
            className="text-negative font-bold text-left"
          >
            {translation.deleteOrganization}
          </button>
        </div>
      </div>
    </div>
  )
}
