import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import Image from 'next/image'

type MediQuuBadgeTranslation = {
  previously: string
}

const defaultMediQuuBadgeTranslation: Record<Languages, MediQuuBadgeTranslation> = {
  en: {
    previously: 'previously'
  },
  de: {
    previously: 'ehemals'
  }
}

export const MediQuuBadge = ({ overwriteTranslation }: PropsForTranslation<MediQuuBadgeTranslation>) => {
  const translation = useTranslation(defaultMediQuuBadgeTranslation, overwriteTranslation)

  return (
    <div className={tw('flex flex-row bg-white rounded-md px-2 py-1 !gap-x-1 !w-fit text-sm font-semibold text-gray-800 items-center')}>
      {translation.previously}
      <Image src="https://cdn.helpwave.de/mediquu/logo_2021.png" alt="" width={80} height={40}/>
    </div>
  )
}
