import { tw, tx } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useState } from 'react'
import { OrganizationForm } from './OrganizationForm'
import type { Role } from './OrganizationMemberList'
import { OrganizationMemberList } from './OrganizationMemberList'
import { ColumnTitle } from './ColumnTitle'
import { Button } from './Button'

type OrganizationDetailTranslation = {
  organizationDetail: string,
  dangerZone: string,
  dangerZoneText: string,
  deleteOrganization: string,
  create: string
}

const defaultOrganizationDetailTranslations: Record<Languages, OrganizationDetailTranslation> = {
  en: {
    organizationDetail: 'Organization Details',
    dangerZone: 'Danger Zone',
    dangerZoneText: 'Deleting the organization is a permanent action and cannot be undone. Be careful!',
    deleteOrganization: 'Delete Organization',
    create: 'Create'
  },
  de: {
    organizationDetail: 'Organisations Details',
    dangerZone: 'Gefahren Zone',
    dangerZoneText: 'Das Löschen einer Organisation is permanent und kann nicht rückgängig gemacht werden. Vorsicht!',
    deleteOrganization: 'Organisation Löschen',
    create: 'Erstellen'
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
  id:string,
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
  const [filledRequired, setFilledRequired] = useState(false)
  const [newOrganization, setNewOrganization] = useState<OrganizationDTO>(organization ?? {
    id: '',
    shortName: '',
    longName: '',
    email: '',
    isVerified: false,
    wards: [],
    members: []
  })

  const isCreatingNewOrganisation = organization === undefined

  return (
    <div className={tw('flex flex-col py-4 px-6 w-5/6')}>
      <ColumnTitle title={translation.organizationDetail}/>
      <OrganizationForm organization={organization}
                        onSave={newOrganizationDetails => {
                          if (isCreatingNewOrganisation) {
                            setNewOrganization({ ...newOrganization, ...newOrganizationDetails })
                            setFilledRequired(true)
                          } else {
                            onUpdate({ ...newOrganization, ...newOrganizationDetails })
                          }
                        }}
      />
      <div className={tw('mt-6')}>
        <OrganizationMemberList members={organization?.members ?? []}
                                onSave={(members) => {
                                  if (isCreatingNewOrganisation) {
                                    setNewOrganization({ ...newOrganization, members })
                                  } else {
                                    onUpdate({ ...newOrganization, members })
                                  }
                                }}/>
      </div>
      <div className={tx('flex flex-col justify-start mt-6', { hidden: isCreatingNewOrganisation })}>
        <span className={tw('font-space text-lg font-bold')}>{translation.dangerZone}</span>
        <span className={tw('text-gray-400')}>{translation.dangerZoneText}</span>
        <button onClick={() => onDelete(newOrganization)} className={tw('text-hw-negative-400 text-left')}>{translation.deleteOrganization}</button>
      </div>
      {isCreatingNewOrganisation &&
        (
          <div className={tw('flex flex-row justify-end mt-6')}>
            <Button className={tw('w-1/2')} onClick={() => onCreate(newOrganization)} disabled={!filledRequired}>{translation.create}</Button>
          </div>
        )
      }
    </div>
  )
}
