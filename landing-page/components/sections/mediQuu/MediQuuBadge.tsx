import type { Languages } from '@helpwave/hightide'
import type { PropsForTranslation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import Image from 'next/image'

type MediQuuBadgeTranslation = {
  previously: string,
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
    <div className="row bg-white rounded-md px-2 py-1 !gap-x-1 !w-fit text-sm font-semibold text-gray-800 items-center">
      {translation.previously}
      <Image src="https://cdn.helpwave.de/mediquu/logo_2021.png" alt="" width={80} height={40}/>
    </div>
  )
}
