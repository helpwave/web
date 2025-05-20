import Image from 'next/image'
import Link from 'next/link'
import type { Languages } from '@helpwave/hightide'
import type { PropsForTranslation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { MarkdownInterpreter } from '@helpwave/hightide'
import { Chip } from '@helpwave/hightide'
import { Helpwave } from '@helpwave/hightide'
import { SectionBase } from '@/components/sections/SectionBase'

type StartSectionTranslation = {
  title: string,
  text: string,
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

  const demoURL = 'https://tasks.helpwave.de'
  const screenshotURL = 'https://cdn.helpwave.de/products/helpwave_tasks_ui_elements.png'

  return (
    <SectionBase
      className="col desktop:flex-row gap-x-16 gap-y-8 justify-center items-center"
      outerClassName="py-24"
    >
      <Image
        alt="Screenshots"
        src={screenshotURL}
        width={0}
        height={0}
        className="object-contain w-full desktop:min-w-[40%] desktop:scale-125 -rotate-12"
      />
      <div className="col gap-y-4">
        <Link href={demoURL} target="_blank">
          <Chip className="row w-fit items-center" color="default">
            <Helpwave size={24} className="min-w-[24px] min-h-[24px]" />
            <span className="font-bold">helpwave tasks</span>
          </Chip>
        </Link>
        <h1 className="textstyle-title-2xl">{translation.title}</h1>
        <MarkdownInterpreter text={translation.text} className="text-xl font-medium" />
      </div>
    </SectionBase>
  )
}

export default StartSection
