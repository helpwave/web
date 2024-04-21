import { tw, tx } from '@helpwave/common/twind'
import Image from 'next/image'
import Link from 'next/link'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { Chip } from '@helpwave/common/components/ChipList'
import { Span } from '@helpwave/common/components/Span'
import { Helpwave } from '@helpwave/common/icons/Helpwave'

type StartSectionTranslation = {
  title: string,
  text: string
}

const defaultStartSectionTranslation: Record<Languages, StartSectionTranslation> = {
  en: {
    title: 'Workflow management for the healthcare industry',
    text: 'At \\helpwave, we don’t see information technology as an old marriage that has fallen asleep, but as \\primary{newly} & \\negative{rekindled} hot affair.'
  },
  de: {
    // TODO update translation
    title: 'Workflow management für das Gesundheitswesen',
    text: 'At \\helpwave, we don’t see information technology as an old marriage that has fallen asleep, but as \\primary{newly} & \\negative{rekindled} hot affair.'
  }
}

const StartSection = ({ overwriteTranslation }: PropsForTranslation<StartSectionTranslation>) => {
  const translation = useTranslation(defaultStartSectionTranslation, overwriteTranslation)

  const demoURL = 'https://staging-tasks.helpwave.de'
  const screenshotURL = 'https://cdn.helpwave.de/products/helpwave_tasks_ui_elements.png'

  return (
    <div className={tw('flex flex-col desktop:flex-row gap-x-32 gap-y-8 justify-center items-center pt-32 pb-16')}>
      <Image
        alt="Screenshots"
        src={screenshotURL}
        width={0}
        height={0}
        className={tx(`object-contain w-full desktop:w-1/2 -rotate-12 z-[-1]`)}
      />

      <div className={tw('flex flex-col gap-y-4')}>
        <Link href={demoURL} target="_blank">
          <Chip className={tw('flex flex-row gap-x-2 w-fit items-center')} color="lightPrimary">
            <Helpwave size={24} className={tw('min-w-[24px] min-h-[24px]')}/>
            <Span className={tw('font-bold')}>helpwave tasks</Span>
          </Chip>
        </Link>
        <h4>
          <Span type="title" className={tw('!text-4xl font-bold')}>{translation.title}</Span>
        </h4>
        <p className={tw('text-xl font-medium')}>
          <MarkdownInterpreter text={translation.text}/>
        </p>
      </div>
    </div>
  )
}

export default StartSection
