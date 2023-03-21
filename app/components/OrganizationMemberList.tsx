import { tw, tx } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Dropdown from '../icons/TriangleDown'
import { useState } from 'react'
import { Checkbox } from './Checkbox'
import { PageIndicator } from './PageIndicator'
import { ProfilePicture } from './ProfilePicture'

export enum Role {
  user,
  admin,
}

type OrganizationMemberListTranslation = {
  edit: string,
  remove: string,
  deselectAll: string,
  selectAll: string,
  members: string,
  addMember: string,
  saveChanges: string,
  role: string,
  of: string,
  roleTypes: (role: Role) => string
}

const defaultOrganizationMemberListTranslations: Record<Languages, OrganizationMemberListTranslation> = {
  en: {
    edit: 'Edit',
    remove: 'Remove',
    deselectAll: 'Deselect all',
    selectAll: 'Select all',
    members: 'Members',
    addMember: 'Add member',
    saveChanges: 'Save changes',
    role: 'Role',
    of: 'of',
    roleTypes: (role: Role) => {
      return { [Role.admin]: 'Admin', [Role.user]: 'User' }[role]
    }
  },
  de: {
    edit: 'Bearbeiten',
    remove: 'Entfernen',
    deselectAll: 'Auswahl aufheben',
    selectAll: 'Alle auswählen',
    members: 'Mitglieder',
    addMember: 'Miglied hinzufügen',
    saveChanges: 'Speichern',
    role: 'Rolle',
    of: 'von',
    roleTypes: (role: Role) => {
      return { [Role.admin]: 'Administrator', [Role.user]: 'Nutzer' }[role]
    }
  }
}

type OrgMember = {
  email: string,
  name: string,
  avatarURL: string,
  role: Role
}

type OrganizationDTO = {
  name: string,
  members: OrgMember[]
}

export type OrganizationMemberListProps = {
  organization: OrganizationDTO,
  usersPerPage?: number
}

export const OrganizationMemberList = ({
  language,
  usersPerPage = 5,
  organization
}: PropsWithLanguage<OrganizationMemberListTranslation, OrganizationMemberListProps>) => {
  const [currentPage, setCurrentPage] = useState(0)
  // State copy of the members, so discarding changes is possible
  const [members, setMembers] = useState<(OrgMember & { isSelected: boolean })[]>(organization.members.map((value) => {
    return { ...value, isSelected: false }
  }))
  const translation = useTranslation(language, defaultOrganizationMemberListTranslations)
  const buttonStyle = ' rounded-md border-2 border-hw-positive-500 text-white bg-hw-positive-400 hover:bg-hw-positive-500 hover:border-hw-positive-600'
  const pages = Math.ceil(members.length / usersPerPage)
  const currentPageMembers = members.slice(currentPage * usersPerPage, Math.min((currentPage + 1) * usersPerPage, members.length))
  return (
    <div className={tw('flex flex-col')}>
      <div className={tw('flex flex-row justify-between items-center')}>
        <span className={tw('font-bold font-space')}>{translation.members + ` (${members.length})`}</span>
        <div className={tw('flex flex-row')}>
          <button className={tw('flex flex-row items-center px-2 mr-2' + buttonStyle)}>
            <span className={tw('mr-2')}>{translation.addMember}</span><Dropdown/>
          </button>
          <button className={tw('px-2' + buttonStyle)}>{translation.saveChanges}</button>
        </div>
      </div>
      <table className={tw(`border-spacing-y-[8px] border-separate h-[${8 * (usersPerPage + 2) + 50 * usersPerPage + 26}px]`)}>
        <tr>
          <th>
            <div className={tw('flex flex-row justify-start')}>
              <Checkbox id="selectAll" label="" checked={undefined} onChange={(_) => undefined}/>
            </div>
          </th>
          <th className={tw('text-left')}>
            <span>{translation.deselectAll}</span>
          </th>
          <th>
            <div className={tw('flex flex-row justify-end items-center select-none')}>
              <span>{translation.role}</span>
              <Dropdown className={tw('ml-2 stroke-black')}/>
            </div>
          </th>
          <th>
            <div className={tw('flex flex-row justify-end select-none')}>
              <span>{translation.remove}</span>
            </div>
          </th>
        </tr>
        {currentPageMembers.map((value, index) => (
          <tr key={value.email}>
            <td>
              <div className={tw('flex flex-row justify-start items-center')}>
                <Checkbox id="selectAll" label="" checked={undefined} onChange={(_) => undefined}/>
              </div>
            </td>
            <td>
              <div className={tw('flex flex-row justify-start items-center')}>
                <ProfilePicture avatarUrl={value.avatarURL} altText="" size="small"/>
                <div className={tw('flex flex-col ml-2')}>
                  <span className={tw('font-bold')}>{value.name}</span>
                  <span className={tw('text-small text-gray-400')}>{value.email}</span>
                </div>
              </div>
            </td>
            <td>
              <div className={tw('flex flex-row justify-end items-center select-none')}>
                <span className={tw('mr-2 font-semibold min-w-[50px] text-right')}>{translation.roleTypes(value.role)}</span>
                <Dropdown className={tw('stroke-black')}/>
              </div>
            </td>
            <td>
              <div className={tw('flex flex-row justify-end items-center select-none')}>
                <button className={tx('font-semibold text-hw-negative-500 hover:text-hw-negative-600 h-8')}>{translation.remove}</button>
              </div>
            </td>
          </tr>
        ))}
        <div className={tx(`h-[${(usersPerPage - currentPageMembers.length) * 50 + (usersPerPage - currentPageMembers.length - 1) * 8}px]`, { hidden: usersPerPage === currentPageMembers.length })}>
        </div>
      </table>
      <div className={tw('flex flex-row justify-center mt-2')}>
        <PageIndicator initialPage={currentPage} numberOfPages={pages} onPageChanged={(page) => setCurrentPage(page)}/>
      </div>
    </div>
  )
}
