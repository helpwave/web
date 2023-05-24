import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { OrganizationForm } from '../OrganizationForm'
import { OrganizationMemberList } from '../OrganizationMemberList'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import type { OrganizationDTO, OrganizationFormType } from '../../pages/organizations'
import { Span } from '@helpwave/common/components/Span'

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
  organizationForm: OrganizationFormType,
  onCreate: (organization: OrganizationDTO) => void,
  onUpdate: (organization: OrganizationDTO) => void,
  onDelete: (organization: OrganizationDTO) => void,
  setOrganization: Dispatch<SetStateAction<OrganizationFormType>>,
  width?: number
}

/**
 * The left side of the organizations page
 */
export const OrganizationDetail = ({
  language,
  organizationForm,
  onCreate,
  onUpdate,
  onDelete,
  setOrganization
}: PropsWithLanguage<OrganizationDetailTranslation, OrganizationDetailProps>) => {
  const translation = useTranslation(language, defaultOrganizationDetailTranslations)
  const isCreatingNewOrganization = organizationForm.organization.id === ''
  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)

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
          onDelete(organizationForm.organization)
        }}
        confirmType="negative"
      />
      <ColumnTitle title={translation.organizationDetail}/>
      <div className={tw('flex flex-col gap-y-4 max-w-[500px]')}>
        <OrganizationForm
          organization={organizationForm.organization}
          onChange={(newOrganizationDetails, isValid) => setOrganization({
            hasChanges: true,
            isValid,
            organization: { ...organizationForm.organization, ...newOrganizationDetails },
          })}
          isShowingErrorsDirectly={!isCreatingNewOrganization}
        />
        <OrganizationMemberList
          members={organizationForm.organization.members}
          onChange={(members) => setOrganization((prevState) => ({
            hasChanges: true,
            isValid: prevState.isValid,
            organization: {
              ...prevState.organization,
              members
            }
          }))}
        />
        <div className={tw('flex flex-row justify-end')}>
          <Button
            className={tw('w-auto')}
            onClick={() => isCreatingNewOrganization ? onCreate(organizationForm.organization) : onUpdate(organizationForm.organization)}
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
