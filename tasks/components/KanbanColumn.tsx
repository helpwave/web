import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import type { TaskDTO, TaskStatus } from '@helpwave/api-services/types/tasks/task'
import { emptyTask } from '@helpwave/api-services/types/tasks/task'
import { Sortable } from './dnd-kit/Sortable'
import { TaskCard } from './cards/TaskCard'
import { PillLabel } from './pill/PillLabel'

type KanbanColumnsTranslation = {
  addTask: string,
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
  draggedTileId?: string,
  onEditTask: (task: TaskDTO) => void,
}

/**
 * The Column of the KanbanBoard showing tasks and affording a reorder of these
 */
export const KanbanColumn = ({
  overwriteTranslation,
  tasks,
  type,
  isDraggedOver,
  draggedTileId,
  onEditTask
}: PropsForTranslation<KanbanColumnsTranslation, KanbanColumnProps>) => {
  const translation = useTranslation(defaultKanbanColumnsTranslations, overwriteTranslation)

  const { setNodeRef } = useDroppable({
    id: type,
  })

  return (
    <div
      className={clsx({ 'border-primary': isDraggedOver, 'border-transparent': !isDraggedOver },
        'col gap-y-4 border-2 border-dashed rounded-lg p-2')}
    >
      <PillLabel count={tasks.length} taskStatus={type}/>
      <SortableContext
        id={type.toString()}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="col gap-y-4">
          {tasks.map((task) => (
            <Sortable key={task.id} id={task.id}>
              <TaskCard
                task={task}
                isSelected={draggedTileId === task.id}
                onClick={() => onEditTask(task)}
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
        className={clsx('row ml-1 gap-x-1 text-gray-300')}
      >
        <Plus/>
        {translation.addTask}
      </button>
    </div>
  )
}
