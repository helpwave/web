import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { HelpwaveBadge } from '@helpwave/common/components/HelpwaveBadge'
import { Span } from '@helpwave/common/components/Span'
import Link from 'next/link'
import Image from 'next/image'
import { ItemGrid } from '@helpwave/common/components/layout/ItemGrid'
import { SectionBase } from '@/components/sections/SectionBase'

type TasksDemoSectionTranslation = {
  helpwaveTasks: string,
  workflowManagement: string,
  tryDemo: string,
  feature1: string,
  feature2: string,
  feature3: string,
  feature4: string
}

const defaultTasksDemoSectionTranslation: Record<Languages, TasksDemoSectionTranslation> = {
  en: {
    helpwaveTasks: 'helpwave tasks',
    workflowManagement: 'The user-centered management tool, designed to simplify workflows and ensure high quality patient care.',
    tryDemo: 'Try demo',
    feature1: 'Patient lists: it’s time to move from papert to digital',
    feature2: 'Care unit overview and tasks: keep track of what’s going on',
    feature3: 'Task templates: standardize recurring tasks and workflows',
    feature4: 'Properties: all relevant facts at a glance',
  },
  de: {
    helpwaveTasks: 'helpwave tasks',
    workflowManagement: 'Das benutzerorientierte Management-Tool zur Vereinfachung von Arbeitsabläufen und zur Gewährleistung einer qualitativ hochwertigen Patientenversorgung.',
    tryDemo: 'Demo testen',
    feature1: 'Patientenlisten: Es ist an der Zeit, von Papier auf digital umzusteigen',
    feature2: 'Stationsübersicht und tasks: Behalten Sie den Überblick',
    feature3: 'Task Vorlagen: Standardisieren Sie wiederkehrende Aufgaben und Arbeitsabläufe',
    feature4: 'Properties: alle relevanten Fakten auf einen Blick',
  }
}

/**
 * A Section for showing helpwave tasks features and information about the demo
 */
export const TasksDemoSection = () => {
  const translation = useTranslation(defaultTasksDemoSectionTranslation)

  const demoURL = 'https://staging-tasks.helpwave.de'
  const imageURL = 'https://cdn.helpwave.de/products/tasks_preview.png'
  return (
    <SectionBase
      className={tw('flex flex-col items-center gap-y-20 w-full')}
      outerClassName={tw('pb-0')}
    >
      <div className={tw('flex flex-col desktop:flex-row w-full items-end justify-between gap-x-16 gap-y-8')}>
        <div className={tw('flex flex-col gap-y-4 desktop:max-w-[70%]')}>
          <HelpwaveBadge className={tw('!text-hw-primary-800 !bg-hw-primary-200 !w-fit')} title={translation.helpwaveTasks}/>
          <Span type="title" className={tw('!text-2xl')}>{translation.workflowManagement}</Span>
          <ItemGrid columns={1} className={tw('font-medium mt-2')}>
            {translation.feature1}
            {translation.feature2}
            {translation.feature3}
            {translation.feature4}
          </ItemGrid>
        </div>
        <Link
          href={demoURL}
          className={tw('bg-white rounded-lg text-lg font-bold text-hw-secondary-800 h-min px-6 py-2')}
          style={{ textWrap: 'nowrap' }} // TODO does not seem supported by the current twind version (throws warnings for text-nowrap)
        >
          {translation.tryDemo}
        </Link>
      </div>
      <Image
        src={imageURL}
        alt=""
        className={tw('w-full rounded-t-2xl max-w-[1000px]')}
        style={{ transform: 'scale(101.28051%, 102.6862%) translate(-0.640255%, -1.3431%)' }}
        width={2351}
        height={1246}
        priority={true}
      />
    </SectionBase>
  )
}
