import { tw, tx } from '@helpwave/common/twind'
import { PillLabel, TaskState } from './pill/PillLabel'
import { TaskCard } from './cards/TaskCard'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Add from '@helpwave/common/icons/Add'
import { useDroppable } from '@dnd-kit/core'
import { Sortable } from './Sortable'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import type { TaskDTO, TaskStatus } from '../mutations/room_mutations'

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

  const taskState = { unscheduled: TaskState.unscheduled, inProgress: TaskState.inProgress, done: TaskState.done }

  return (
    <div
      className={tx({ 'border-hw-primary-400': isDraggedOver, 'border-transparent': !isDraggedOver },
        'flex flex-col gap-y-4 border-2 border-dashed rounded-lg p-2')}
    >
      <PillLabel count={tasks.length} state={taskState[type]}/>
      <SortableContext
        id={type}
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
          status: type,
          id: '',
          name: 'New Task',
          description: '',
          subtasks: [],
          assignee: '',
          isPublicVisible: false,
          dueDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000))
        })}
        className={tw('flex flex-row ml-1 gap-x-1 text-gray-300')}
      >
        <Add/>
        {translation.addTask}
      </button>
    </div>
  )
}
