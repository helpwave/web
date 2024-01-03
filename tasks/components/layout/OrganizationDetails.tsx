import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Span } from '@helpwave/common/components/Span'
import { emptyOrganizationForm, OrganizationForm, type OrganizationFormType } from '../OrganizationForm'
import { OrganizationMemberList } from '../OrganizationMemberList'
import { ColumnTitle } from '../ColumnTitle'
import { ReSignInModal } from '../ReSignInModal'
import { OrganizationInvitationList, type OrganizationInvitation } from '../OrganizationInvitationList'
import { OrganizationContext } from '@/pages/organizations'
import {
  type OrganizationMinimalDTO,
  useInviteMemberMutation,
  useOrganizationCreateMutation,
  useOrganizationDeleteMutation,
  useOrganizationQuery,
  useOrganizationUpdateMutation
} from '@/mutations/organization_mutations'
import { useAuth } from '@/hooks/useAuth'

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
    dangerZone: 'Risikobereich',
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
      className={tw('flex flex-col py-4 px-6')}
    >
      <ConfirmDialog
        id="organizationDetail-DeleteDialog"
        titleText={translation.deleteConfirmText}
        descriptionText={translation.dangerZoneText}
        isOpen={isShowingConfirmDialog}
        onCancel={() => setIsShowingConfirmDialog(false)}
        onBackgroundClick={() => setIsShowingConfirmDialog(false)}
        onCloseClick={() => setIsShowingConfirmDialog(false)}
        onConfirm={() => {
          setIsShowingConfirmDialog(false)
          deleteOrganization(contextState.organizationId)
        }}
        confirmType="negative"
      />
      <ReSignInModal
        id="organizationDetail-ReSignInModal"
        isOpen={!!isShowingReSignInDialog}
        onBackgroundClick={() => {
          setIsShowingReSignInDialog(undefined)
          resetForm()
        }}
        onDecline={() => {
          setIsShowingReSignInDialog(undefined)
          resetForm()
        }}
        onCloseClick={() => {
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
      <div className={tw('flex flex-col gap-y-4 max-w-[500px]')}>
        <OrganizationForm
          organizationForm={organizationForm}
          onChange={(organizationForm, shouldUpdate) => {
            setOrganizationForm(organizationForm)
            if (shouldUpdate) {
              updateOrganization(organizationForm.organization)
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
        <div className={tw('flex flex-row justify-end')}>
          <Button
            className={tw('w-auto')}
            onClick={() => isCreatingNewOrganization ? createOrganization(organizationForm.organization) : updateOrganization(organizationForm.organization)}
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
