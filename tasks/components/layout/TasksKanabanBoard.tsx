import type { DragEndEvent, DragOverEvent, DragStartEvent, DropAnimation } from '@dnd-kit/core'
import {
  closestCorners,
  defaultDropAnimation,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { tw } from '@helpwave/common/twind'
import { KanbanColumn } from '../KanbanColumn'
import { TaskCard } from '../cards/TaskCard'
import { KanbanHeader } from '../KanbanHeader'
import type { SortedTasks, TaskDTO } from '../../mutations/task_mutations'
import {
  emptySortedTasks,
  useTasksByPatientSortedByStatusQuery, useTaskToDoneMutation, useTaskToInProgressMutation,
  useTaskToToDoMutation
} from '../../mutations/task_mutations'
import { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import React, { useEffect, useState } from 'react'

export type KanbanBoardObject = {
  draggedID?: string,
  searchValue: string,
  overColumn?: TaskStatus
}

type KanbanBoardProps = {
  patientID: string,
  onEditTask: (task: TaskDTO) => void,
  editedTaskID?: string
}

/**
 * A Kanban-Board for showing and changing tasks
 *
 * The State is managed by the parent component
 */
export const TasksKanbanBoard = ({
  patientID,
  onEditTask,
  editedTaskID
}: KanbanBoardProps) => {
  const { data, isLoading, isError } = useTasksByPatientSortedByStatusQuery(patientID)
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

  const taskToToDoMutation = useTaskToToDoMutation(() => undefined)
  const taskToInProgressMutation = useTaskToInProgressMutation(() => undefined)
  const taskToDoneMutation = useTaskToDoneMutation(() => undefined)

  const onEndChanging = () => {
    if (!boardObject.draggedID) {
      return
    }
    switch (boardObject.overColumn) {
      case TaskStatus.TASK_STATUS_TODO:
        taskToToDoMutation.mutate(boardObject.draggedID)
        break
      case TaskStatus.TASK_STATUS_IN_PROGRESS:
        taskToInProgressMutation.mutate(boardObject.draggedID)
        break
      case TaskStatus.TASK_STATUS_DONE:
        taskToDoneMutation.mutate(boardObject.draggedID)
        break
      default:
        break
    }
  }

  if (isError) {
    return <div>Error in TasksKanbanBoard!</div>
  }

  if (isLoading) {
    return <div>Loading TasksKanbanBoard!</div>
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
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setBoardObject({ ...boardObject, draggedID: active.id as string })
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeColumn = findColumn(active.id as string)
    const overColumn = findColumn(over?.id as string)

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return
    }

    const activeItems = sortedTasks[activeColumn]
    const overItems = sortedTasks[overColumn]

    // Find the indexes for the items
    const activeIndex = activeItems.findIndex(item => item.id === active.id)
    const overIndex = overItems.findIndex(item => item.id !== over?.id)

    sortedTasks[activeColumn][activeIndex].status = overColumn
    setSortedTasks({
      ...sortedTasks,
      [activeColumn]: [
        ...sortedTasks[activeColumn].filter(item => item.id !== active.id),
      ],
      [overColumn]: [
        ...sortedTasks[overColumn].slice(0, overIndex),
        sortedTasks[activeColumn][activeIndex],
        ...sortedTasks[overColumn].slice(overIndex, sortedTasks[overColumn].length),
      ],
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

    setBoardObject({ ...boardObject, draggedID: undefined, overColumn: undefined })
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

  const task = boardObject.draggedID ?
      [...sortedTasks[TaskStatus.TASK_STATUS_TODO], ...sortedTasks[TaskStatus.TASK_STATUS_IN_PROGRESS], ...sortedTasks[TaskStatus.TASK_STATUS_DONE]].find(value => value && value.id === boardObject.draggedID)
    : null

  function filterBySearch(tasks: TaskDTO[]): TaskDTO[] {
    return tasks.filter(value => value.name.replaceAll(' ', '').toLowerCase().indexOf(boardObject.searchValue.replaceAll(' ', '').toLowerCase()) !== -1)
  }

  return (
    <div>
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
            draggedTileID={boardObject.draggedID ?? editedTaskID}
            isDraggedOver={boardObject.overColumn === TaskStatus.TASK_STATUS_TODO}
            onEditTask={onEditTask}
          />
          <KanbanColumn
            type={TaskStatus.TASK_STATUS_IN_PROGRESS}
            tasks={filterBySearch(sortedTasks[TaskStatus.TASK_STATUS_IN_PROGRESS])}
            draggedTileID={boardObject.draggedID ?? editedTaskID}
            isDraggedOver={boardObject.overColumn === TaskStatus.TASK_STATUS_IN_PROGRESS}
            onEditTask={onEditTask}
          />
          <KanbanColumn
            type={TaskStatus.TASK_STATUS_DONE}
            tasks={filterBySearch(sortedTasks[TaskStatus.TASK_STATUS_DONE])}
            draggedTileID={boardObject.draggedID ?? editedTaskID}
            isDraggedOver={boardObject.overColumn === TaskStatus.TASK_STATUS_DONE}
            onEditTask={onEditTask}
          />
          <DragOverlay dropAnimation={dropAnimation}>
            {task && <TaskCard task={task}/>}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  )
}
