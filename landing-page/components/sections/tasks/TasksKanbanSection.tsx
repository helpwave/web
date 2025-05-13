import type { PropsForTranslation } from '@helpwave/hightide/hooks/useTranslation'
import { useTranslation } from '@helpwave/hightide/hooks/useTranslation'
import type { Languages } from '@helpwave/hightide/hooks/useLanguage'
import Image from 'next/image'
import { MarkdownInterpreter } from '@helpwave/hightide/components/MarkdownInterpreter'
import { TagIcon } from '@helpwave/hightide/components/icons/Tag'
import { SectionBase } from '@/components/sections/SectionBase'

type TasksKanbanSectionTranslation = {
  title: string,
  description: string,
  tasks: string,
}

const defaultTasksKanbanSectionTranslation: Record<Languages, TasksKanbanSectionTranslation> = {
  en: {
    title: 'Effective teamwork',
    description: 'Are you part of the treatment team? See the progress without having to ask.',
    tasks: 'Collaborate'
  },
  de: {
    title: 'Effektive Teamarbeit',
    description: 'Sind Sie Teil des Behandlungsteams? Sehen Sie Behandlungsfortschritte, ohne fragen zu müssen.',
    tasks: 'Zusammenarbeiten'
  }
}

export const TasksKanbanSection = ({ overwriteTranslation }: PropsForTranslation<TasksKanbanSectionTranslation>) => {
  const translation = useTranslation(defaultTasksKanbanSectionTranslation, overwriteTranslation)
  const imageUrl = 'https://cdn.helpwave.de/products/tasks_kanban.png'

  return (
    <SectionBase
      className="max-tablet:flex max-tablet:flex-wrap-reverse max-tablet:justify-center tablet:row tablet:justify-between w-full !gap-x-16 gap-y-8 items-center"
      backgroundColor="variant"
    >
      <div className="col gap-y-2 pb-16 max-tablet:pb-0">
        <div className="col gap-y-2">
          <div className="row gap-x-1 text-primary items-center">
            <TagIcon/>
            <span className="textstyle-title-normal">{translation.tasks}</span>
          </div>
          <h1 className="textstyle-title-2xl">{translation.title}</h1>
          <span className="font-space font-semibold"><MarkdownInterpreter text={translation.description}/></span>
        </div>
      </div>
      <div
        className="row bottom-0 justify-center rounded-l-3xl max-tablet:w-5/6 min-w-[50%] z-10"
      >
        <Image
          src={imageUrl}
          alt=""
          width={0}
          height={0}
          className="w-fit desktop:max-h-[70vh] p-4 rounded-lg dark:bg-white"
        />
      </div>
    </SectionBase>
  )
}
