import { tw, tx } from '@helpwave/common/twind'
import { PillLabel, TaskState } from './pill/PillLabel'
import { TaskCard } from './cards/TaskCard'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useDroppable } from '@dnd-kit/core'
import { Sortable } from './dnd-kit/Sortable'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import type { TaskDTO } from '../mutations/task_mutations'
import type { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import { Plus } from 'lucide-react'
import { emptyTask } from '../mutations/task_mutations'

type KanbanColumnsTranslation = {
  addTask: string
}

const defaultKanbanColumnsTranslations: Record<Languages, KanbanColumnsTranslation> = {
  en: {
    addTask: 'Add new Tasks'
  },
  de: {
    addTask: 'Aufgabe hinzufügen'
  }
}

type KanbanColumnProps = {
  tasks: TaskDTO[],
  type: TaskStatus,
  isDraggedOver: boolean,
  draggedTileID?: string,
  onEditTask: (task: TaskDTO) => void
}

/**
 * The Column of the KanbanBoard showing tasks and affording a reorder of these
 */
export const KanbanColumn = ({
  language,
  tasks,
  type,
  isDraggedOver,
  draggedTileID,
  onEditTask
}: PropsWithLanguage<KanbanColumnsTranslation, KanbanColumnProps>) => {
  const translation = useTranslation(language, defaultKanbanColumnsTranslations)

  const { setNodeRef } = useDroppable({
    id: type,
  })

  return (
    <div
      className={tx({ 'border-hw-primary-400': isDraggedOver, 'border-transparent': !isDraggedOver },
        'flex flex-col gap-y-4 border-2 border-dashed rounded-lg p-2')}
    >
      <PillLabel count={tasks.length} state={TaskState[type]}/>
      <SortableContext
        id={type.toString()}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex flex-col gap-y-4">
          {tasks.map((task) => (
            <Sortable key={task.id} id={task.id}>
              <TaskCard
                task={task}
                isSelected={draggedTileID === task.id}
                onTileClick={() => onEditTask(task)}
              />
            </Sortable>
          ))}
        </div>
      </SortableContext>
      <button
        onClick={() => onEditTask({
          ...emptyTask,
          status: type,
          dueDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000))
        })}
        className={tw('flex flex-row ml-1 gap-x-1 text-gray-300')}
      >
        <Plus/>
        {translation.addTask}
      </button>
    </div>
  )
}
