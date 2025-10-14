import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import { TextButton } from '@helpwave/hightide'
import { ConfirmDialog, type PropsForTranslation, SolidButton, useTranslation } from '@helpwave/hightide'
import { useContext, useEffect, useState } from 'react'
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
import { usePropertyListQuery } from '@helpwave/api-services/mutations/properties/property_mutations'
import Link from 'next/link'

type OrganizationDetailTranslation = {
  organizationDetail: string,
  dangerZone: string,
  dangerZoneText: string,
  deleteConfirmText: string,
  deleteOrganization: string,
  create: string,
  update: string,
  properties: string,
  propertiesDescription: string,
  manageProperties: string,
}

const defaultOrganizationDetailTranslations: Translation<OrganizationDetailTranslation> = {
  en: {
    organizationDetail: 'Organization Details',
    dangerZone: 'Danger Zone',
    dangerZoneText: 'Deleting the organization is a permanent action and cannot be undone. Be careful!',
    deleteConfirmText: 'Do you really want to delete this organization?',
    deleteOrganization: 'Delete Organization',
    create: 'Create',
    update: 'Update',
    properties: 'Properties',
    propertiesDescription: 'With properties you can add custom fields to different entities you patients or beds.',
    manageProperties: 'Manage Properties'
  },
  de: {
    organizationDetail: 'Organisations Details',
    dangerZone: 'Risikobereich',
    dangerZoneText: 'Das Löschen einer Organisation ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!',
    deleteConfirmText: 'Wollen Sie wirklich diese Organisation löschen?',
    deleteOrganization: 'Organisation löschen',
    create: 'Erstellen',
    update: 'Ändern',
    properties: 'Eigenschaften',
    propertiesDescription: 'Mit Eigenschaften können Sie verschiedenen Entitäten wie Patienten oder Betten benutzerdefinierte Felder hinzufügen.',
    manageProperties: 'Eigenschaften Verwalten'
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
  const translation = useTranslation([defaultOrganizationDetailTranslations], overwriteTranslation)

  const {
    state: contextState,
    updateContext
  } = useContext(OrganizationContext)

  const { signOut } = useAuth()
  const isCreatingNewOrganization = contextState.organizationId === ''
  const { data } = useOrganizationQuery(contextState.organizationId)
  const { data: propertyData } = usePropertyListQuery()
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
      className="col gap-y-0 py-4 px-6"
    >
      <ConfirmDialog
        titleElement={translation('deleteConfirmText')}
        description={translation('dangerZoneText')}
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
        onCancel={() => {
          setIsShowingReSignInDialog(undefined)
          resetForm()
        }}
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
      <ColumnTitle title={translation('organizationDetail')}/>
      <div className="col gap-y-6">
        <OrganizationForm
          organizationForm={organizationForm}
          onChange={(organizationForm, shouldUpdate) => {
            setOrganizationForm(organizationForm)
            if (shouldUpdate) {
              updateOrganization(organizationForm.organization).catch(console.error)
            }
          }}
          className="max-w-96"
        />
        {!isCreatingNewOrganization && (
          <OrganizationMemberList/>
        )}
        <OrganizationInvitationList
          onChange={setOrganizationInvites}
          invitations={isCreatingNewOrganization ? organizationInvites : undefined}
          organizationId={contextState.organizationId}
        />
        {propertyData && !isCreatingNewOrganization && (
          <div className="card-lg flex-row-0 justify-between">
            <div className="flex-col-0">
              <span className="textstyle-title-lg">{`${translation('properties')} (${propertyData.length})`}</span>
              <span className="text-description">{`${translation('propertiesDescription')} (${propertyData.length})`}</span>
            </div>
            <div className={clsx('flex flex-row justify-end items-center')}>
              <Link href="/properties" className="bg-primary text-on-primary">
                {translation('manageProperties')}
              </Link>
            </div>
          </div>
        )}
        <div className="row justify-end">
          <SolidButton
            className="w-auto"
            onClick={() => isCreatingNewOrganization ? createOrganization(organizationForm.organization) : updateOrganization(organizationForm.organization)}
            disabled={!organizationForm.isValid}>
            {isCreatingNewOrganization ? translation('create') : translation('update')}
          </SolidButton>
        </div>
        <div className={clsx('col justify-start', { hidden: isCreatingNewOrganization })}>
          <ColumnTitle
            title={translation('dangerZone')}
            description={translation('dangerZoneText')}
            type="subtitle"
          />
          <TextButton
            onClick={() => setIsShowingConfirmDialog(true)}
            color="negative"
            className="w-min"
          >
            {translation('deleteOrganization')}
          </TextButton>
        </div>
      </div>
    </div>
  )
}
