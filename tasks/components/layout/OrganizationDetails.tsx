import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useState } from 'react'
import { OrganizationForm } from '../OrganizationForm'
import type { Role } from '../OrganizationMemberList'
import { OrganizationMemberList } from '../OrganizationMemberList'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'

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
    dangerZoneText: 'Das Löschen einer Organisation is permanent und kann nicht rückgängig gemacht werden. Vorsicht!',
    deleteConfirmText: 'Wollen Sie wirklich diese Organisation löschen?',
    deleteOrganization: 'Organisation Löschen',
    create: 'Erstellen',
    update: 'Ändern'
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

export type OrganizationDetailProps = {
  organization?: OrganizationDTO,
  onCreate: (organization: OrganizationDTO) => void,
  onUpdate: (organization: OrganizationDTO) => void,
  onDelete: (organization: OrganizationDTO) => void
}

export const OrganizationDetail = ({
  language,
  organization,
  onCreate,
  onUpdate,
  onDelete,
}: PropsWithLanguage<OrganizationDetailTranslation, OrganizationDetailProps>) => {
  const translation = useTranslation(language, defaultOrganizationDetailTranslations)
  const isCreatingNewOrganization = organization === undefined

  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)
  const [filledRequired, setFilledRequired] = useState(!isCreatingNewOrganization)
  const [newOrganization, setNewOrganization] = useState<OrganizationDTO>(organization ?? {
    id: '',
    shortName: '',
    longName: '',
    email: '',
    isVerified: false,
    wards: [],
    members: []
  })

  return (
    <div className={tw('flex flex-col py-4 px-6 w-5/6')}>
      <ConfirmDialog
        title={translation.deleteConfirmText}
        description={translation.dangerZoneText}
        isOpen={isShowingConfirmDialog}
        onCancel={() => setIsShowingConfirmDialog(false)}
        onBackgroundClick={() => setIsShowingConfirmDialog(false)}
        onConfirm={() => {
          setIsShowingConfirmDialog(false)
          onDelete(newOrganization)
        }}
      />
      <ColumnTitle title={translation.organizationDetail}/>
      <OrganizationForm
        organization={newOrganization}
        onChange={(newOrganizationDetails, isValid) => {
          setNewOrganization({ ...newOrganization, ...newOrganizationDetails })
          setFilledRequired(isValid)
        }}
        isShowingErrorsDirectly={!isCreatingNewOrganization}
      />
      <div className={tw('mt-6')}>
        <OrganizationMemberList
          members={newOrganization.members}
          onChange={(members) => setNewOrganization({ ...newOrganization, members })}
        />
      </div>
      <div className={tx('flex flex-col justify-start mt-6', { hidden: isCreatingNewOrganization })}>
        <span className={tw('font-space text-lg font-bold')}>{translation.dangerZone}</span>
        <span className={tw('text-gray-400')}>{translation.dangerZoneText}</span>
        <button
          onClick={() => setIsShowingConfirmDialog(true)}
          className={tw('text-hw-negative-400 font-bold text-left')}
        >
          {translation.deleteOrganization}
        </button>
      </div>
      <div className={tw('flex flex-row justify-end mt-6')}>
        <Button
          className={tw('w-1/2')}
          onClick={() => isCreatingNewOrganization ? onCreate(newOrganization) : onUpdate(newOrganization)}
          disabled={!filledRequired}>
          {isCreatingNewOrganization ? translation.create : translation.update}
        </Button>
      </div>
    </div>
  )
}
