import clsx from 'clsx'
import Image from 'next/image'
import type { Languages } from '@helpwave/hightide/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/hightide/hooks/useTranslation'
import { useTranslation } from '@helpwave/hightide/hooks/useTranslation'
import { SectionBase } from '@/components/sections/SectionBase'

type FeatureItemProps = {
  imageUrl: string,
  size: number,
  title: string,
  description: string,
  reverse?: boolean,
}

const FeatureItem = ({
                       imageUrl,
                       size,
                       title,
                       description,
                       reverse = false
                     }: FeatureItemProps) => {
  return (
    <div className={clsx('max-tablet:col-reverse items-center gap-x-4 gap-y-6 desktop:!gap-x-8 justify-between', {
      'flex-row-reverse': reverse,
      'flex-row': !reverse
    })}>
      <div className="w-1/2 max-tablet:!w-full">
        <Image
          alt="Screenshots" src={imageUrl}
          style={{ objectFit: 'contain', width: `${size}px` }}
          width={size} height={size}
          className="shadow-md hover:shadow-2xl transition-all duration-500 w-full rounded-md"/>
      </div>

      <div className="col w-1/3 max-tablet:!w-full">
        <span className="textstyle-title-2xl">
          {title}
        </span>
        <span className="textstyle-description text-gray-600">
          {description}
        </span>
      </div>
    </div>
  )
}

type FeatureSectionTranslation = {
  taskTemplatesTitle: string,
  taskTemplatesText: string,
  collaborateTitle: string,
  collaborateText: string,
  patientsTitle: string,
  patientsText: string,
}

const defaultFeatureSectionTranslation: Record<Languages, FeatureSectionTranslation> = {
  en: {
    taskTemplatesTitle: 'Task Templates',
    taskTemplatesText: 'Save repetitive tasks as templates. Standardize your workflows, share them with your team.',
    collaborateTitle: 'Collaborate',
    collaborateText: 'You and your team synchronized on the same heartbeat.',
    patientsTitle: 'Patients',
    patientsText: 'Modern dashboards for your patients. Keep track of their progress and tasks.'
  },
  de: {
    taskTemplatesTitle: 'Aufgabenvorlagen',
    taskTemplatesText: 'Speichere sich wiederholende Aufgaben als Vorlagen. Standardisiere deine Arbeitsabläufe und teile sie mit deinem Team.',
    collaborateTitle: 'Zusammenarbeiten',
    collaborateText: 'Du und dein Team arbeiten auf den Herzschlag synchronisiert zusammen.',
    patientsTitle: 'Patienten',
    patientsText: 'Moderne Dashboards für deine Patienten. Behalte den Überblick über den Fortschritt und deine Aufgaben.'
  }
}

const FeatureSection = ({ overwriteTranslation }: PropsForTranslation<FeatureSectionTranslation>) => {
  const translation = useTranslation(defaultFeatureSectionTranslation, overwriteTranslation)
  const screenshotTemplates = 'https://cdn.helpwave.de/screenshots/tasks_2.png'
  const screenshotCollab = 'https://cdn.helpwave.de/screenshots/tasks_3.png'
  const screenshotPatients = 'https://cdn.helpwave.de/screenshots/tasks_4.png'
  const size = 1024

  return (
    <SectionBase className="col gap-y-12">
      <FeatureItem
        imageUrl={screenshotTemplates}
        size={size}
        title={translation.taskTemplatesTitle}
        description={translation.taskTemplatesText}
      />

      <FeatureItem
        imageUrl={screenshotCollab}
        size={size}
        title={translation.collaborateTitle}
        description={translation.collaborateText}
        reverse={true}
      />

      <FeatureItem
        imageUrl={screenshotPatients}
        size={size}
        title={translation.patientsTitle}
        description={translation.patientsText}
      />
    </SectionBase>
  )
}

export default FeatureSection
