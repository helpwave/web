import { tw } from '@helpwave/style-themes/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { type PropsForTranslation, useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { ModalProps } from '@helpwave/common/components/modals/Modal'
import { Modal } from '@helpwave/common/components/modals/Modal'
import type { SelectOption } from '@helpwave/common/components/user-input/Select'
import { Select } from '@helpwave/common/components/user-input/Select'
import { useMemo, useState } from 'react'
import { SolidButton } from '@helpwave/common/components/Button'
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
      <div className={tw('w-[320px]')}>
        <Select
          className={tw('mt-2')}
          value={organization}
          options={organizationOptions}
          onChange={setOrganization}
        />
        <div className={tw('flex flex-row mt-3 gap-x-4 justify-end')}>
          <SolidButton autoFocus color="hw-positive" disabled={!organization} onClick={onDone}>
            {translation.ok}
          </SolidButton>
        </div>
      </div>
    </Modal>
  )
}
