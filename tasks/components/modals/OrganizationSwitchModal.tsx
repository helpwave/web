import type { ModalProps, SelectOption, Translation } from '@helpwave/hightide'
import { Modal, type PropsForTranslation, Select, SolidButton, useTranslation } from '@helpwave/hightide'
import { useMemo, useState } from 'react'
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

const defaultOrganizationSwitchModalTranslation: Translation<OrganizationSwitchModalTranslation> = {
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

export const OrganizationSwitchModal = ({
                                          overwriteTranslation,
                                          onDone: onDoneToCaller,
                                          currentOrganization,
                                          organizations,
                                          headerProps,
                                          ...modalProps
                                        }: PropsForTranslation<OrganizationSwitchModalTranslation, OrganizationSwitchModalProps>) => {
  const translation = useTranslation([defaultOrganizationSwitchModalTranslation], overwriteTranslation)
  const [organization, setOrganization] = useState(currentOrganization ?? '')
  const organizationOptions = useMemo(() => organizationsToOptions(organizations), [organizations])

  const onDone = () => {
    if (!organization) return
    const selectedOrganization = organizations?.find((org) => org.id === organization)
    onDoneToCaller(selectedOrganization)
  }

  return (
    <Modal
      headerProps={{
        ...headerProps,
        titleText: headerProps?.titleText ?? translation('switchOrganization')      }}
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
            {translation('ok')}
          </SolidButton>
        </div>
      </div>
    </Modal>
  )
}
