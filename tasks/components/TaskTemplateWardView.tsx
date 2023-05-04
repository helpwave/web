import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { SubTaskDTO } from '../mutations/room_mutations'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'
import { useRouter } from 'next/router'
import { TaskTemplateCard } from './cards/TaskTemplateCard'

type ComponentTranslation = {
  showAllTaskTemplates: string,
  taskTemplates: (numberOfTemplates: number) => string
}

const defaultComponentTranslation: Record<Languages, ComponentTranslation> = {
  en: {
    showAllTaskTemplates: 'Show all Task Templates',
    taskTemplates: (numberOfTemplates) => `Task Templates (${numberOfTemplates})`
  },
  de: {
    showAllTaskTemplates: 'Show all Task Vorlagen',
    taskTemplates: (numberOfTemplates) => `Task Vorlagen (${numberOfTemplates})`
  }
}

// TODO delete later
type TaskTemplateDTO = {
  id: string,
  name: string,
  notes: string,
  subtasks: SubTaskDTO[],
  isPublicVisible: boolean
}

export type ComponentProps = {
  taskTemplates: TaskTemplateDTO[]
}

/**
 * A Component for showing all TaskTemplate within a ward
 */
export const TaskTemplateWardView = ({
  language,
  taskTemplates
}: PropsWithLanguage<ComponentTranslation, ComponentProps>) => {
  const translation = useTranslation(language, defaultComponentTranslation)
  const router = useRouter()

  return (
    <div className={tw('flex flex-col')}>
      <div className={tw('flex flex-row justify-between items-center mb-4')}>
        <Span type="tableName">{translation.taskTemplates(taskTemplates.length)}</Span>
        { /* TODO Change link below later on */}
        <Button
          className={tw('w-auto')}
          onClick={() => router.push('/ward/templates')}
        >
          {translation.showAllTaskTemplates}
        </Button>
      </div>
      <div className={tw('grid grid-cols-3 gap-4')}>
        {taskTemplates.map((taskTemplate, index) => (
          <TaskTemplateCard
            key={index}
            name={taskTemplate.name}
            subtaskCount={taskTemplate.subtasks.length}
            onTileClick={() => { /* TODO do something onClick */ }}
          />
        ))}
      </div>
    </div>
  )
}
