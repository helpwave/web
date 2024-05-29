import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { Span } from '@helpwave/common/components/Span'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { TagIcon } from '@helpwave/common/icons/Tag'
import { SectionBase } from '@/components/sections/SectionBase'

type TasksTemplatesSectionTranslation = {
  title: string,
  description: string,
  taskTemplates: string
}

const defaultTasksTemplatesSectionTranslation: Record<Languages, TasksTemplatesSectionTranslation> = {
  en: {
    title: 'Quality management and time efficiency',
    description: 'Save recurring tasks as templates. Standardize your workflows and share them with your team.',
    taskTemplates: 'Task Templates'
  },
  de: {
    title: 'Qualitätsmanagement und Zeiteffizienz',
    description: 'Speichern Sie wiederkehrende Aufgaben als Vorlagen. Standardisieren Sie Ihre Arbeitsabläufe und teilen Sie diese mit Ihrem Team.',
    taskTemplates: 'Task Templates'
  }
}

export const TasksTemplatesSection = ({ overwriteTranslation }: PropsForTranslation<TasksTemplatesSectionTranslation>) => {
  const translation = useTranslation(defaultTasksTemplatesSectionTranslation, overwriteTranslation)
  const imageUrl = 'https://cdn.helpwave.de/products/tasks_template_with_filter.png'

  return (
    <SectionBase
      className={tw('flex flex-row mobile:!flex-wrap-reverse w-full gap-x-16 gap-y-4 justify-between mobile:justify-center items-center text-white')}
      backgroundColor="darkSecondary"
    >
      <div className={tw('flex flex-col gap-y-2 pb-16 mobile:pb-0 overflow-hidden break-words')}>
        <div className={tw('flex flex-col gap-y-2')}>
          <div className={tw('flex flex-row gap-x-1 text-hw-primary-800 items-center')}>
            <TagIcon/>
            <Span className={tw('text-lg font-bold')}>{translation.taskTemplates}</Span>
          </div>
          <h1><Span type="title" className={tw('!text-4xl')}>{translation.title}</Span></h1>
          <Span className={tw('font-space font-semibold')}><MarkdownInterpreter text={translation.description}/></Span>
        </div>
      </div>
      <div
        className={tw('flex flex-row bottom-0 justify-center rounded-l-3xl mobile:w-full min-w-[50%] z-10 desktop:scale-125')}
      >
        <Image
          src={imageUrl}
          alt=""
          width={0}
          height={0}
          className={tw('w-fit desktop:max-h-[70vh]')}
        />
      </div>
    </SectionBase>
  )
}
