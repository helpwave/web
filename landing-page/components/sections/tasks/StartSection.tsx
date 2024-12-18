import { tw, tx } from '@helpwave/common/twind'
import Image from 'next/image'
import Link from 'next/link'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { Chip } from '@helpwave/common/components/ChipList'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { SectionBase } from '@/components/sections/SectionBase'

type StartSectionTranslation = {
  title: string,
  text: string
}

const defaultStartSectionTranslation: Record<Languages, StartSectionTranslation> = {
  en: {
    title: 'The first open source team management platform for healthcare professionals',
    text: 'Patient care is teamwork. \\b{helpwave tasks} increases the \\primary{productivity} in your clinical team. Ditch the printed ward list and coordinate the teamwork in a modern Kanban interface that has been inspired by industry \\primary{best practices} from lean project management.'
  },
  de: {
    title: 'Die erste Open Source Teammanagement-Plattform für das Gesundheitswesen',
    text: 'Patientenversorgung ist Teamarbeit. \\b{helpwave tasks} erhöht die Produktivität in Ihrem klinischen Team. Schmeißen Sie die gedruckte Stationsliste weg und koordinieren Sie die Teamarbeit in einer modernen Kanban-Oberfläche, die von den \\primary{best practices} des lean Projektmanagements inspiriert wurde.'
  }
}

const StartSection = ({ overwriteTranslation }: PropsForTranslation<StartSectionTranslation>) => {
  const translation = useTranslation(defaultStartSectionTranslation, overwriteTranslation)

  const demoURL = 'https://staging-tasks.helpwave.de'
  const screenshotURL = 'https://cdn.helpwave.de/products/helpwave_tasks_ui_elements.png'

  return (
    <SectionBase
      className={tw('flex flex-col desktop:flex-row gap-x-16 gap-y-8 justify-center items-center')}
      outerClassName={tw('py-24')}
    >
      <Image
        alt="Screenshots"
        src={screenshotURL}
        width={0}
        height={0}
        className={tx(`object-contain w-full desktop:w-1/2 desktop:scale-125 -rotate-12`)}
      />
      <div className={tw('flex flex-col gap-y-4')}>
        <Link href={demoURL} target="_blank">
          <Chip className={tw('flex flex-row gap-x-2 w-fit items-center')} color="lightPrimary">
            <Helpwave size={24} className={tw('min-w-[24px] min-h-[24px]')}/>
            <span className={tw('font-bold')}>helpwave tasks</span>
          </Chip>
        </Link>
        <h1 className={tw('textstyle-title-2xl')}>{translation.title}</h1>
        <MarkdownInterpreter text={translation.text} className={tw('text-xl font-medium')}/>
      </div>
    </SectionBase>
  )
}

export default StartSection
