import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { TagIcon } from '@helpwave/common/icons/Tag'
import { SectionBase } from '@/components/sections/SectionBase'

type TasksKanbanSectionTranslation = {
  title: string,
  description: string,
  tasks: string
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
      className={tw('flex flex-row mobile:!flex-wrap-reverse w-full gap-x-16 gap-y-8 justify-between mobile:justify-center items-center')}
      backgroundColor="white"
    >
      <div className={tw('flex flex-col gap-y-2 pb-16 mobile:pb-0')}>
        <div className={tw('flex flex-col gap-y-2')}>
          <div className={tw('flex flex-row gap-x-1 text-hw-primary-800 items-center')}>
            <TagIcon/>
            <span className={tw('textstyle-title-normal')}>{translation.tasks}</span>
          </div>
          <h1 className={tw('textstyle-title-2xl')}>{translation.title}</h1>
          <span className={tw('font-space font-semibold')}><MarkdownInterpreter text={translation.description}/></span>
        </div>
      </div>
      <div
        className={tw('flex flex-row bottom-0 justify-center rounded-l-3xl mobile:w-full min-w-[50%] z-10')}
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
