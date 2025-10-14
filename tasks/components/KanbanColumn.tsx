import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import { type PropsForTranslation, TextButton, useTranslation } from '@helpwave/hightide'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import type { TaskDTO, TaskStatus } from '@helpwave/api-services/types/tasks/task'
import { emptyTask } from '@helpwave/api-services/types/tasks/task'
import { Sortable } from './dnd-kit/Sortable'
import { TaskCard } from './cards/TaskCard'
import { PillLabel } from './PillLabel'

type KanbanColumnsTranslation = {
  addTask: string,
}

const defaultKanbanColumnsTranslations: Translation<KanbanColumnsTranslation> = {
  en: {
    addTask: 'Add'
  },
  de: {
    addTask: 'Hinzufügen'
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
  const translation = useTranslation([defaultKanbanColumnsTranslations], overwriteTranslation)

  const { setNodeRef } = useDroppable({
    id: type,
  })

  return (
    <div
      className={clsx(
        { 'border-primary': isDraggedOver, 'border-transparent': !isDraggedOver },
        'flex-col-2 border-2 border-dashed rounded-lg p-2',
        {
          'bg-tag-green-text/5': type === 'done',
          'bg-tag-yellow-text/5': type === 'inProgress',
          'bg-tag-red-text/5': type === 'todo',
        }
      )}
    >
      <PillLabel count={tasks.length} taskStatus={type}/>
      <SortableContext
        id={type.toString()}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex-col-2 min-h-64 max-h-64 overflow-y-auto">
          <TextButton
            onClick={() => onEditTask({
              ...emptyTask,
              status: type,
              dueDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000))
            })}
            startIcon={<Plus/>}
          >
            {translation('addTask')}
          </TextButton>
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
    </div>
  )
}
