import { tw } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Add from '@helpwave/common/icons/Add'
import type { CardProps } from './Card'
import { Card } from './Card'

type OrganizationAddCardTranslation = {
  addOrganization: string
}

const defaultOrganizationAddCardTranslations: Record<Languages, OrganizationAddCardTranslation> = {
  en: {
    addOrganization: 'Add new Organization'
  },
  de: {
    addOrganization: 'Organisation hinzufügen'
  }
}

export type OrganizationAddCardProps = CardProps

export const OrganizationAddCard = ({
  language,
  isSelected,
  onTileClick = () => undefined
}: PropsWithLanguage<OrganizationAddCardTranslation, CardProps>) => {
  const translation = useTranslation(language, defaultOrganizationAddCardTranslations)

  return (
    <Card onTileClick={onTileClick} isSelected={isSelected} className={tw('cursor-pointer h-24')}>
      <div className={tw('flex flex-row justify-center items-center gap-x-1 text-gray-400 h-full')}>
        <Add/>
        <span>{translation.addOrganization}</span>
      </div>
    </Card>
  )
}
