import type { Languages } from '@helpwave/hightide'
import { type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import type { ModalProps } from '@helpwave/hightide'
import { Modal } from '@helpwave/hightide'
import type { SelectOption } from '@helpwave/hightide'
import { Select } from '@helpwave/hightide'
import { useMemo, useState } from 'react'
import { SolidButton } from '@helpwave/hightide'
import type { OrganizationDTO } from '@helpwave/api-services/types/users/organizations'

type OrganizationSwitchModalTranslation = {
  switchOrganization: string,
  ok: string,
}

type OrganizationSwitchModalProps = ModalProps & {
  currentOrganization?: string,
  organizations?: OrganizationDTO[],
  onDone: (organization?: OrganizationDTO) => void,
}

const defaultOrganizationSwitchModalTranslation: Record<Languages, OrganizationSwitchModalTranslation> = {
  en: {
    switchOrganization: 'Switch organization',
    ok: 'Ok',
  },
  de: {
    switchOrganization: 'Organisation wechseln',
    ok: 'Ok',
  }
}

const organizationsToOptions = (organizations?: OrganizationDTO[]): SelectOption<string>[] => {
  return (organizations ?? []).map((organization) => ({
    value: organization.id,
    label: `${organization.longName} (${organization.shortName})`,
  }))
}

export const OrganizationSwitchModal = ({ overwriteTranslation, onDone: onDoneToCaller, currentOrganization, organizations, ...modalProps }: PropsForTranslation<OrganizationSwitchModalTranslation, OrganizationSwitchModalProps>) => {
  const translation = useTranslation(defaultOrganizationSwitchModalTranslation, overwriteTranslation)
  const [organization, setOrganization] = useState(currentOrganization ?? '')
  const organizationOptions = useMemo(() => organizationsToOptions(organizations), [organizations])

  const onDone = () => {
    if (!organization) return
    const selectedOrganization = organizations?.find((org) => org.id === organization)
    onDoneToCaller(selectedOrganization)
  }

  return (
    <Modal
      titleText={translation.switchOrganization}
      {...modalProps}
    >
      <div className="w-[320px]">
        <Select
          className="mt-2"
          value={organization}
          options={organizationOptions}
          onChange={setOrganization}
        />
        <div className="row mt-3 gap-x-4 justify-end">
          <SolidButton autoFocus color="positive" disabled={!organization} onClick={onDone}>
            {translation.ok}
          </SolidButton>
        </div>
      </div>
    </Modal>
  )
}
