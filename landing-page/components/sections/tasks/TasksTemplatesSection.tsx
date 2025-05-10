import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { TagIcon } from '@helpwave/common/components/icons/Tag'
import { SectionBase } from '@/components/sections/SectionBase'

type TasksTemplatesSectionTranslation = {
  title: string,
  description: string,
  taskTemplates: string,
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
      className="max-tablet:flex max-tablet:flex-wrap-reverse max-tablet:justify-center tablet:row tablet:justify-between w-full !gap-x-16 gap-y-8 items-center"
      backgroundColor="secondary"
      outerClassName="py-24"
    >
      <div className="col gap-y-2 pb-16 max-tablet:pb-0 overflow-hidden break-words">
        <div className="col gap-y-2">
          <div className="row gap-x-1 text-primary items-center">
            <TagIcon/>
            <span className="textstyle-title-normal">{translation.taskTemplates}</span>
          </div>
          <h1 className="textstyle-title-2xl">{translation.title}</h1>
          <span className="font-space font-semibold"><MarkdownInterpreter text={translation.description}/></span>
        </div>
      </div>
      <div
        className="row bottom-0 justify-center rounded-l-3xl max-tablet:w-full min-w-[50%] z-10 desktop:scale-125"
      >
        <Image
          src={imageUrl}
          alt=""
          width={0}
          height={0}
          className="w-fit desktop:max-h-[70vh]"
        />
      </div>
    </SectionBase>
  )
}
