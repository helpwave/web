import type { DialogProps, Translation } from '@helpwave/hightide'
import { SelectOption } from '@helpwave/hightide'
import { Dialog } from '@helpwave/hightide'
import { type PropsForTranslation, Select, SolidButton, useTranslation } from '@helpwave/hightide'
import { useState } from 'react'
import type { OrganizationDTO } from '@helpwave/api-services/types/users/organizations'

type OrganizationSwitchModalTranslation = {
  switchOrganization: string,
  ok: string,
}

type OrganizationSwitchModalProps = DialogProps & {
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

export const OrganizationSwitchModal = ({
                                          overwriteTranslation,
                                          onDone: onDoneToCaller,
                                          currentOrganization,
                                          organizations,
                                          ...modalProps
                                        }: PropsForTranslation<OrganizationSwitchModalTranslation, OrganizationSwitchModalProps>) => {
  const translation = useTranslation([defaultOrganizationSwitchModalTranslation], overwriteTranslation)
  const [organization, setOrganization] = useState(currentOrganization ?? '')

  const onDone = () => {
    if (!organization) return
    const selectedOrganization = organizations?.find((org) => org.id === organization)
    onDoneToCaller(selectedOrganization)
  }

  return (
    <Dialog
      {...modalProps}
      titleElement={modalProps?.titleElement ?? translation('switchOrganization')}
    >
      <div className="w-[320px]">
        <Select
          value={organization}
          onValueChanged={setOrganization}
          buttonProps={{
            className: 'mt-2',
            selectedDisplay: (selected) => {
              const organization = organizations?.find(value => value.id === selected)
              if(!organization) {
                return '-'
              }
              return `${organization.longName} (${organization.shortName})`
            }
        }}
        >
          {organizations?.map((organization) => (
            <SelectOption key={organization.id} value={organization.id}>
              {`${organization.longName} (${organization.shortName})`}
            </SelectOption>
          ))}
        </Select>
        <div className="row mt-3 gap-x-4 justify-end">
          <SolidButton autoFocus color="positive" disabled={!organization} onClick={onDone}>
            {translation('ok')}
          </SolidButton>
        </div>
      </div>
    </Dialog>
  )
}
