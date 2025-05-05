import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import clsx from 'clsx'
import Image from 'next/image'
import { HelpwaveBadge } from '@helpwave/common/components/HelpwaveBadge'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { SectionBase } from '@/components/sections/SectionBase'

type MediQuuHeaderTranslation = {
  title: string,
  subTitle: string,
}

const defaultMediQuuPageTranslation: Record<Languages, MediQuuHeaderTranslation> = {
  en: {
    title: 'mediQuu becomes helpwave',
    subTitle: 'helpwave becomes the new operator of the mediQuu platform and will continue to develop the digital ' +
      'applications with a strong team in the future. \\b{There will be no changes for mediQuu customers}, ' +
      'a smooth transition is anticipated.',
  },
  de: {
    title: 'Aus mediQuu wird helpwave',
    subTitle: 'helpwave wird neuer Betreiber der mediQuu-Plattform und zukünftig mit einem starken Team die digitalen ' +
      'Anwendungen weiterentwickeln. \\b{Für mediQuu-Kunden wird es keine Veränderungen geben}, ' +
      'ein reibungsloser Übergang ist avisiert.',
  }
}

export const MediQuuHeaderSection = () => {
  const translation = useTranslation(defaultMediQuuPageTranslation)
  return (
    <SectionBase backgroundColor="gray">
      <div className={clsx('row w-full gap-x-4 gap-y-8 mobile:!col-reverse mobile:items-center')}>
        <div className={clsx('col gap-y-2 desktop:max-w-[50%]')}>
          <span className={clsx('textstyle-title-3xl')}>{translation.title}</span>
          <span className={clsx('text-lg')}><MarkdownInterpreter text={translation.subTitle}/></span>
        </div>
        <div className={clsx('row justify-center items-center grow')}>
          <div className={clsx('col gap-y-4 min-w-[350px] max-w-[350px]')}>
            <div className={clsx('bg-white rounded-md px-6 py-4 !gap-x-2 !w-fit shadow-md')}>
              <Image src="https://cdn.helpwave.de/mediquu/logo_2021.png" alt="" width={140} height={64}/>
            </div>
            <div className={clsx('row justify-end')}>
              <HelpwaveBadge
                size="large"
                className="bg-secondary !gap-x-2 !w-fit shadow-md py-4 px-6"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionBase>
  )
}
