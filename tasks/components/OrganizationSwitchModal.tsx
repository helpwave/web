import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { type PropsWithLanguage, useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { ModalProps } from '@helpwave/common/components/modals/Modal'
import { Modal } from '@helpwave/common/components/modals/Modal'
import type { SelectOption } from '@helpwave/common/components/user-input/Select'
import { Select } from '@helpwave/common/components/user-input/Select'
import { useMemo, useState } from 'react'
import { Button } from '@helpwave/common/components/Button'
import type { OrganizationDTO } from '@/mutations/organization_mutations'
import { useOrganizationsForUserQuery } from '@/mutations/organization_mutations'

type OrganizationSwitchModalTranslation = {
  switchOrganization: string,
  ok: string
}

type OrganizationSwitchModalProps = ModalProps & {
  onDone: (organization?: OrganizationDTO) => void
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

export const OrganizationSwitchModal = ({ language, onDone: onDoneToCaller, ...modalProps }: PropsWithLanguage<OrganizationSwitchModalTranslation, OrganizationSwitchModalProps>) => {
  const translation = useTranslation(language, defaultOrganizationSwitchModalTranslation)
  const { data: organizations } = useOrganizationsForUserQuery()
  const [organization, setOrganization] = useState('')
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
          <Button autoFocus color="positive" disabled={!organization} onClick={onDone}>
            {translation.ok}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
