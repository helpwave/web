import { tw, tx } from '@helpwave/common/twind'
import { Link as LinkIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { SectionBase } from '@/components/sections/SectionBase'

type TalksTranslation = {
  fusionOfHealthcareAndComputerScience: string

}

const defaultTaskTranslation: Record<Languages, TalksTranslation> = {
  en: {
    fusionOfHealthcareAndComputerScience: 'Fusion of healthcare and computer science. Interviews. Retrospectives. Foundation.',
  },
  de: {
    fusionOfHealthcareAndComputerScience: 'Fusion von Gesundheitswesen und Informatik. Interviews. Retrospektiven. Grundlagen.',
  }
}

const StartSection = ({ overwriteTranslation }: PropsForTranslation<TalksTranslation>) => {
  const translation = useTranslation(defaultTaskTranslation, overwriteTranslation)
  const podcastURL = 'https://podcasters.spotify.com/pod/show/helpwave/'
  const screenshotURL = 'https://cdn.helpwave.de/thumbnail/thumbnail_03.png'
  const size = 1024

  return (
    <SectionBase>
      <Link href={podcastURL} target="_blank">
        <h1 className={tw('font-space text-6xl font-bold')}>
          helpwave <span className={tw('text-hw-pool-orange')}>talks</span>
          <LinkIcon className={tw('ml-4 inline text-gray-400')} />
        </h1>
      </Link>

      <h4 className={tw('font-sans text-2xl font-medium mt-2 text-gray-600')}>
        {translation.fusionOfHealthcareAndComputerScience}
      </h4>

      <Image alt="Screenshots" src={screenshotURL} style={{ objectFit: 'contain' }} width={size} height={size} className={tx(`w-[${size}px] shadow-md hover:shadow-2xl transition-all duration-500 w-full rounded-md mt-8`)}/>
    </SectionBase>
  )
}

export default StartSection
