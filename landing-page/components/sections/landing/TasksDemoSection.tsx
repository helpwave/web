import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { HelpwaveBadge } from '@helpwave/common/components/HelpwaveBadge'
import { Span } from '@helpwave/common/components/Span'
import Link from 'next/link'
import Image from 'next/image'
import { SectionBase } from '@/components/sections/SectionBase'

type TasksDemoSectionTranslation = {
  helpwaveTasks: string,
  workflowManagement: string,
  tryDemo: string,
  feature1: string,
  feature2: string,
  feature3: string,
  feature4: string,
  feature5: string,
  feature6: string
}

const defaultTasksDemoSectionTranslation: Record<Languages, TasksDemoSectionTranslation> = {
  en: {
    helpwaveTasks: 'helpwave tasks',
    workflowManagement: 'Workflow management for the healthcare industry',
    tryDemo: 'Try demo',
    feature1: 'Feature 1',
    feature2: 'Feature 2',
    feature3: 'Feature 3',
    feature4: 'Feature 4',
    feature5: 'Feature 5',
    feature6: 'Feature 6'
  },
  de: {
    helpwaveTasks: 'helpwave tasks',
    workflowManagement: 'Workflow-Management für das Gesundheitswesen',
    tryDemo: 'Demo ausprobieren',
    feature1: 'Feature 1',
    feature2: 'Feature 2',
    feature3: 'Feature 3',
    feature4: 'Feature 4',
    feature5: 'Feature 5',
    feature6: 'Feature 6'
  }
}

/**
 * Description
 */
export const TasksDemoSection = () => {
  const translation = useTranslation(defaultTasksDemoSectionTranslation)

  const demoURL = 'https://staging-tasks.helpwave.de'
  const imageURL = 'https://cdn.helpwave.de/products/tasks_preview.png'
  return (
    <SectionBase className={tw('flex flex-col gap-y-8 !pb-0 w-full')}>
      <div className={tw('flex flex-row w-full items-end justify-between gap-x-16')}>
        <div className={tw('flex flex-col gap-y-2')}>
          <HelpwaveBadge className={tw('!text-hw-primary-800 !bg-hw-primary-200 !w-fit')} title={translation.helpwaveTasks}/>
          <Span type="title" className={tw('!text-2xl')}>{translation.workflowManagement}</Span>
          <table>
            <tbody>
              <tr key="r1">
                <td>{translation.feature1}</td>
                <td>{translation.feature4}</td>
              </tr>
              <tr key="r2">
                <td>{translation.feature2}</td>
                <td>{translation.feature5}</td>
              </tr>
              <tr key="r3">
                <td>{translation.feature3}</td>
                <td>{translation.feature6}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Link href={demoURL} className={tw('bg-black rounded-lg text-white h-min px-4 py-2')}>
          {translation.tryDemo}
        </Link>
      </div>
      <Image
        src={imageURL}
        alt=""
        className={tw('w-full rounded-t-2xl')}
        style={{ transform: 'scale(101.28051%, 102.6862%) translate(-0.640255%, -1.3431%)' }}
        width={2351}
        height={1246}
        priority={true}
      />
    </SectionBase>
  )
}
