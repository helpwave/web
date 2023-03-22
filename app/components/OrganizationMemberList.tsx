import { useState } from 'react'
import { tw, tx } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Dropdown from '../icons/TriangleDown'
import { PageIndicator } from './PageIndicator'
import { ProfilePicture } from './ProfilePicture'
import { TriStateCheckbox } from './TriStateCheckbox'

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
  const headerHeight = 26
  const rowHeight = 50

  const getSelectionState = () => {
    let selectionState: boolean | null = members.at(0)?.isSelected ?? false
    for (const member of members) {
      if (member.isSelected !== selectionState) {
        selectionState = null
        break
      }
    }
    return selectionState
  }

  const selectionState = getSelectionState()

  const changeAllSelection = (value: boolean | null) => {
    if (value === null) {
      return
    }
    members.forEach(member => {
      member.isSelected = value
    })
    // New Array to trigger update
    setMembers([...members])
  }

  const changeSingleSelection = (value: boolean, member: OrgMember & { isSelected: boolean }) => {
    member.isSelected = value
    setMembers([...members])
  }

  const removeSelected = () => {
    setMembers(members.filter(value => !value.isSelected))
  }

  const singleRemove = (member: OrgMember & {isSelected: boolean}) => {
    setMembers(members.filter(value => value !== member))
  }

  const saveChanges = () => {
    // TODO api call
  }

  const hasChanges = () => {
    if (members.length !== organization.members.length) {
      return true
    }
    for (let i = 0; i < members.length; i++) {
      const mem1 = members[i]
      const mem2 = organization.members[i]
      // TODO replace later on with an equality check on the object
      if (mem1.role !== mem2.role || mem1.name !== mem2.name || mem1.email !== mem2.email || mem1.avatarURL !== mem2.avatarURL) {
        return true
      }
    }
    return false
  }

  const disableSaveChanges = !hasChanges()

  const addUser = () => {
    // TODO remove below for an actual user add
    const newMember = {
      name: 'user' + (members.length + 1),
      role: Role.user,
      email: `user${(members.length + 1)}@helpwave.de`,
      isSelected: false,
      avatarURL: ''
    }
    setMembers([...members, newMember])
    // Automatically go to the last page
    setCurrentPage(Math.ceil((members.length + 1) / usersPerPage) - 1)
  }

  const roleClicked = () => {
    // TODO do something when clicking the role button
  }

  return (
    <div className={tw('flex flex-col')}>
      <div className={tw('flex flex-row justify-between items-center')}>
        <span className={tw('font-bold font-space')}>{translation.members + ` (${members.length})`}</span>
        <div className={tw('flex flex-row')}>
          <button onClick={addUser} className={tw('flex flex-row items-center px-2 mr-2' + buttonStyle)}>
            <span className={tw('mr-2')}>{translation.addMember}</span><Dropdown/>
          </button>
          <button onClick={saveChanges} disabled={disableSaveChanges} className={tx('px-2' + buttonStyle)}>{translation.saveChanges}</button>
        </div>
      </div>
      <table
        className={tw(`border-spacing-y-[8px] border-separate h-[${8 * (usersPerPage + 2) + rowHeight * usersPerPage + headerHeight}px]`)}>
        <thead>
        <tr className={tw(`h-[${headerHeight}px]`)}>
          <th>
            <div className={tw('flex flex-row justify-start')}>
              <TriStateCheckbox checked={selectionState} onChanged={changeAllSelection}/>
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
              <span onClick={removeSelected} className={tw('cursor-pointer')}>{translation.remove}</span>
            </div>
          </th>
        </tr>
        </thead>
        <tbody>
        {currentPageMembers.map((member) => (
          <tr key={member.email} className={tw(`h-[${rowHeight}px]`)}>
            <td>
              <div className={tw('flex flex-row justify-start items-center')}>
                <TriStateCheckbox checked={member.isSelected}
                                  onChanged={(value) => changeSingleSelection(value === null ? false : value, member)}/>
              </div>
            </td>
            <td>
              <div className={tw('flex flex-row justify-start items-center')}>
                <ProfilePicture avatarUrl={member.avatarURL} altText="" size="small"/>
                <div className={tw('flex flex-col ml-2')}>
                  <span className={tw('font-bold')}>{member.name}</span>
                  <span className={tw('text-small text-gray-400')}>{member.email}</span>
                </div>
              </div>
            </td>
            <td>
              <div className={tw('flex flex-row justify-end items-center')}>
                <button onClick={roleClicked} className={tw('flex flex-row justify-end items-center')}>
                    <span
                      className={tw(`mr-2 font-semibold min-w-[${rowHeight}px] text-right`)}>{translation.roleTypes(member.role)}</span>
                  <Dropdown className={tw('stroke-black')}/>
                </button>
              </div>
            </td>
            <td>
              <div className={tw('flex flex-row justify-end items-center select-none')}>
                <button onClick={() => singleRemove(member)}
                  className={tx('font-semibold text-hw-negative-500 hover:text-hw-negative-600 h-8')}>{translation.remove}</button>
              </div>
            </td>
          </tr>
        ))}
        {
          usersPerPage === currentPageMembers.length ? null : (
            <tr
              className={tx(`h-[${(usersPerPage - currentPageMembers.length) * rowHeight + (usersPerPage - currentPageMembers.length - 1) * 8}px]`)}/>
          )}
        </tbody>
      </table>
      <div className={tw('flex flex-row justify-center mt-2')}>
        <PageIndicator page={currentPage} numberOfPages={pages} onPageChanged={(page) => setCurrentPage(page)}/>
      </div>
    </div>
  )
}
