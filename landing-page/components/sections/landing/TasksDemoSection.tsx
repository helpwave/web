import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { HelpwaveBadge } from '@helpwave/common/components/HelpwaveBadge'
import Link from 'next/link'
import Image from 'next/image'
import { SectionBase } from '@/components/sections/SectionBase'
import { Check } from 'lucide-react'

type TasksDemoSectionTranslation = {
  helpwaveTasks: string,
  workflowManagement: string,
  tryDemo: string,
  feature1: string,
  feature2: string,
  feature3: string,
  feature4: string,
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
      className={clsx('col items-center gap-y-20 w-full')}
      outerClassName={clsx('pb-0')}
    >
      <div className={clsx('col desktop:flex-row w-full items-end justify-between gap-x-16 gap-y-8')}>
        <div className={clsx('col gap-y-4 desktop:max-w-[70%]')}>
          <HelpwaveBadge className={clsx('text-primary bg-purple-100 !w-fit')} title={translation.helpwaveTasks}/>
          <span className={clsx('textstyle-title-lg')}>{translation.workflowManagement}</span>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 overflow-x-auto mt-2">
            {[translation.feature1, translation.feature2, translation.feature3, translation.feature4].map((feature, index) => (
              <div key={index} className="row items-center">
                <div
                  className={clsx('col justify-center items-center bg-primary text-white rounded-full min-w-[24px] min-h-[24px]')}>
                  <Check size={18} strokeWidth={2.5}/>
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <Link
          href={demoURL}
          className={clsx('btn-md hover:brightness-[98%] bg-on-primary text-primary font-bold text-lg whitespace-nowrap')}
        >
          {translation.tryDemo}
        </Link>
      </div>
      <Image
        src={imageURL}
        alt=""
        className={clsx('w-full rounded-t-2xl max-w-[1000px]')}
        style={{ transform: 'scale(101.28051%, 102.6862%) translate(-0.640255%, -1.3431%)' }}
        width={2351}
        height={1246}
        priority={true}
      />
    </SectionBase>
  )
}
