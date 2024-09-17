import {
  closestCorners,
  defaultDropAnimation,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DropAnimation
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { tw } from '@helpwave/common/twind'
import { TaskStatus } from '@helpwave/proto-ts/services/task_svc/v1/task_svc_pb'
import { useEffect, useState } from 'react'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { KanbanColumn } from '../KanbanColumn'
import { TaskCard } from '../cards/TaskCard'
import { KanbanHeader } from '../KanbanHeader'
import { DndContext, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@/components/dnd-kit-instances/tasks'
import {
  emptySortedTasks,
  useTasksByPatientSortedByStatusQuery,
  useTaskToDoneMutation,
  useTaskToInProgressMutation,
  useTaskToToDoMutation,
  type SortedTasks,
  type TaskDTO
} from '@/mutations/task_mutations'

export type KanbanBoardObject = {
  draggedId?: string,
  searchValue: string,
  overColumn?: TaskStatus
}

type KanbanBoardProps = {
  patientId: string,
  onEditTask: (task: TaskDTO) => void,
  editedTaskId?: string
}

/**
 * A Kanban-Board for showing and changing tasks
 *
 * The State is managed by the parent component
 */
export const TasksKanbanBoard = ({
  patientId,
  onEditTask,
  editedTaskId
}: KanbanBoardProps) => {
  const { data, isLoading, isError } = useTasksByPatientSortedByStatusQuery(patientId)
  const [boardObject, setBoardObject] = useState<KanbanBoardObject>({ searchValue: '' })
  const [sortedTasks, setSortedTasks] = useState<SortedTasks>(emptySortedTasks)

  useEffect(() => {
    if (data) {
      setSortedTasks(data)
    }
  }, [data])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const taskToToDoMutation = useTaskToToDoMutation()
  const taskToInProgressMutation = useTaskToInProgressMutation()
  const taskToDoneMutation = useTaskToDoneMutation()

  const onEndChanging = () => {
    if (!boardObject.draggedId) {
      return
    }
    switch (boardObject.overColumn) {
      case TaskStatus.TASK_STATUS_TODO:
        taskToToDoMutation.mutate(boardObject.draggedId)
        break
      case TaskStatus.TASK_STATUS_IN_PROGRESS:
        taskToInProgressMutation.mutate(boardObject.draggedId)
        break
      case TaskStatus.TASK_STATUS_DONE:
        taskToDoneMutation.mutate(boardObject.draggedId)
        break
      default:
        break
    }
  }

  function findColumn(id: string | TaskStatus): TaskStatus | undefined {
    if (id in sortedTasks) {
      return id as TaskStatus
    }

    if (sortedTasks[TaskStatus.TASK_STATUS_TODO].find(value => value.id === id)) {
      return TaskStatus.TASK_STATUS_TODO
    }
    if (sortedTasks[TaskStatus.TASK_STATUS_IN_PROGRESS].find(value => value.id === id)) {
      return TaskStatus.TASK_STATUS_IN_PROGRESS
    }
    if (sortedTasks[TaskStatus.TASK_STATUS_DONE].find(value => value.id === id)) {
      return TaskStatus.TASK_STATUS_DONE
    }

    return undefined
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setBoardObject({ ...boardObject, draggedId: active.id as string })
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeColumn = findColumn(active.id as string)
    const overColumn = findColumn(over?.id as string)

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return
    }

    const activeItems = sortedTasks[activeColumn]
    const overItems = sortedTasks[overColumn]

    // Item index (order) of the column, which the user drags the task from
    const activeIndex = activeItems.findIndex(item => item.id === active.id)
    // Item index (order) of the column, which the user drags the task to
    const overIndex = overItems.findIndex(item => item.id !== over?.id)

    // If it can't identify the dragged item
    if (activeIndex === -1) {
      return
    }

    const newActiveColumn = sortedTasks[activeColumn].filter(item => item.id !== active.id)

    // -1 means, that there was no task found, which you dragged your task over
    const insertAtIndex = overIndex === -1 ? 0 : overIndex
    // Insert task at insertAtIndex in the overColumn
    const newOverColumn = [...sortedTasks[overColumn].slice(0, insertAtIndex), sortedTasks[activeColumn][activeIndex] as TaskDTO, ...sortedTasks[overColumn].slice(insertAtIndex)]

    // The last array access is safe as we checked the index before (> -1 and < length; findIndex will not return something >= length)
    sortedTasks[activeColumn][activeIndex]!.status = overColumn
    setSortedTasks({
      ...sortedTasks,
      [activeColumn]: newActiveColumn,
      [overColumn]: newOverColumn,
    })

    setBoardObject({ ...boardObject, overColumn })
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeColumn = findColumn(active.id as string)
    const overColumn = findColumn(over?.id as string)

    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return
    }

    const activeIndex = sortedTasks[activeColumn].findIndex(task => task.id === active.id)
    const overIndex = sortedTasks[overColumn].findIndex(task => task.id === over?.id)

    setBoardObject({ ...boardObject, draggedId: undefined, overColumn: undefined })
    if (activeIndex !== overIndex) {
      const newSortedTasks = {
        ...sortedTasks,
        [overColumn]: arrayMove(sortedTasks[overColumn], activeIndex, overIndex),
      }
      setSortedTasks(newSortedTasks)
      onEndChanging()
    } else {
      onEndChanging()
    }
  }

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  }

  const task = boardObject.draggedId ?
      [...sortedTasks[TaskStatus.TASK_STATUS_TODO], ...sortedTasks[TaskStatus.TASK_STATUS_IN_PROGRESS], ...sortedTasks[TaskStatus.TASK_STATUS_DONE]].find(value => value && value.id === boardObject.draggedId)
    : null

  function filterBySearch(tasks: TaskDTO[]): TaskDTO[] {
    return tasks.filter(value => value.name.replaceAll(' ', '').toLowerCase().indexOf(boardObject.searchValue.replaceAll(' ', '').toLowerCase()) !== -1)
  }

  return (
    <LoadingAndErrorComponent
      isLoading={isLoading}
      hasError={isError}
      loadingProps={{ classname: tw('border-2 border-gray-600 rounded-xl min-h-[300px]') }}
      errorProps={{ classname: tw('border-2 border-gray-600 rounded-xl min-h-[300px]') }}
      minimumLoadingDuration={200}
    >
      <KanbanHeader
        searchValue={boardObject.searchValue}
        onSearchChange={text => setBoardObject({ ...boardObject, searchValue: text })}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={tw('grid grid-cols-3 gap-x-4 mt-6')}>
          <KanbanColumn
            type={TaskStatus.TASK_STATUS_TODO}
            tasks={filterBySearch(sortedTasks[TaskStatus.TASK_STATUS_TODO])}
            draggedTileId={boardObject.draggedId ?? editedTaskId}
            isDraggedOver={boardObject.overColumn === TaskStatus.TASK_STATUS_TODO}
            onEditTask={onEditTask}
          />
          <KanbanColumn
            type={TaskStatus.TASK_STATUS_IN_PROGRESS}
            tasks={filterBySearch(sortedTasks[TaskStatus.TASK_STATUS_IN_PROGRESS])}
            draggedTileId={boardObject.draggedId ?? editedTaskId}
            isDraggedOver={boardObject.overColumn === TaskStatus.TASK_STATUS_IN_PROGRESS}
            onEditTask={onEditTask}
          />
          <KanbanColumn
            type={TaskStatus.TASK_STATUS_DONE}
            tasks={filterBySearch(sortedTasks[TaskStatus.TASK_STATUS_DONE])}
            draggedTileId={boardObject.draggedId ?? editedTaskId}
            isDraggedOver={boardObject.overColumn === TaskStatus.TASK_STATUS_DONE}
            onEditTask={onEditTask}
          />
          <DragOverlay dropAnimation={dropAnimation}>
            {task && <TaskCard task={task}/>}
          </DragOverlay>
        </div>
      </DndContext>
    </LoadingAndErrorComponent>
  )
}
