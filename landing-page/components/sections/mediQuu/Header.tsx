import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import Image from 'next/image'
import { HelpwaveBadge } from '@helpwave/common/components/HelpwaveBadge'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'

type MediQuuHeaderTranslation = {
  title: string,
  subTitle: string
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
    <div className={tw('flex desktop:flex-row mobile:flex-col-reverse gap-8 mobile:items-center justify-center max-w-[1000px]')}>
      <div className={tw('flex flex-col gap-y-2 max-w-')}>
        <Span type="title" className={tw('!text-5xl')}>{translation.title}</Span>
        <Span className={tw('text-lg')}><MarkdownInterpreter text={translation.subTitle}/></Span>
      </div>
      <div className={tw('flex flex-col gap-y-4 min-w-[350px] max-w-[350px]')}>
        <div className={tw('bg-white rounded-md px-6 py-4 !gap-x-2 !w-fit shadow-md')}>
          <Image src="https://cdn.helpwave.de/mediquu/logo_2021.png" alt="" width={140} height={64}/>
        </div>
        <div className={tw('flex flex-row grow justify-end')}>
          <HelpwaveBadge
            size="large"
            className="bg-hw-secondary-800 !gap-x-2 !w-fit shadow-md"
          />
        </div>
      </div>
    </div>
  )
}
