import React, { useState } from 'react'
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DropAnimation
} from '@dnd-kit/core'
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCorners,
  DragOverlay,
  defaultDropAnimation
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import { tw } from '@helpwave/common/twind'
import type { TaskStatus } from '../KanbanColumn'
import { KanbanColumn } from '../KanbanColumn'
import { TaskCard } from '../cards/TaskCard'
import { KanbanHeader } from '../KanbanHeader'

type KanbanBoardObject = {
  draggedID?: string,
  searchValue: string,
  overColumn?: string
}

type TaskDTO = {
  id: string,
  name: string,
  description: string,
  status: 'unscheduled' | 'inProgress' | 'done',
  progress: number
}

type KanbanBoardProps = {
  tasks: TaskDTO[]
}

export const KanbanBoard = ({ tasks }: KanbanBoardProps) => {
  const [sortedTasks, setSortedTasks] = useState(
    {
      unscheduled: tasks.filter(value => value.status === 'unscheduled'),
      inProgress: tasks.filter(value => value.status === 'inProgress'),
      done: tasks.filter(value => value.status === 'done'),
    }
  )

  const [boardObject, setBoardObject] = useState<KanbanBoardObject>({ searchValue: '' })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function findColumn(id: string): TaskStatus | undefined {
    if (id in sortedTasks) {
      return id as 'unscheduled' | 'inProgress' | 'done'
    }

    if (sortedTasks.unscheduled.find(value => value.id === id)) {
      return 'unscheduled'
    }
    if (sortedTasks.inProgress.find(value => value.id === id)) {
      return 'inProgress'
    }
    if (sortedTasks.done.find(value => value.id === id)) {
      return 'done'
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

    setSortedTasks((boardSection) => {
      const activeItems = boardSection[activeColumn]
      const overItems = boardSection[overColumn]

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex(item => item.id === active.id)
      const overIndex = overItems.findIndex(item => item.id !== over?.id)

      sortedTasks[activeColumn][activeIndex].status = overColumn

      return {
        ...boardSection,
        [activeColumn]: [
          ...boardSection[activeColumn].filter(item => item.id !== active.id),
        ],
        [overColumn]: [
          ...boardSection[overColumn].slice(0, overIndex),
          sortedTasks[activeColumn][activeIndex],
          ...boardSection[overColumn].slice(overIndex, boardSection[overColumn].length),
        ],
      }
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

    if (activeIndex !== overIndex) {
      setSortedTasks((boardSection) => ({
        ...boardSection,
        [overColumn]: arrayMove(boardSection[overColumn], activeIndex, overIndex),
      }))
    }
    setBoardObject({ ...boardObject, draggedID: undefined, overColumn: undefined })
  }

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  }

  const task = boardObject.draggedID ?
      [...sortedTasks.unscheduled, ...sortedTasks.inProgress, ...sortedTasks.done].find(value => value && value.id === boardObject.draggedID)
    : null

  function filterBySearch(tasks: TaskDTO[]) : TaskDTO[] {
    return tasks.filter(value => value.name.toLowerCase().startsWith(boardObject.searchValue.toLowerCase()))
  }

  return (
    <div>
      <KanbanHeader searchValue={boardObject.searchValue} onSearchChange={text => setBoardObject({ ...boardObject, searchValue: text })}/>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={tw('grid grid-cols-3 gap-x-4 mt-6')}>
          <KanbanColumn type="unscheduled" tasks={filterBySearch(sortedTasks.unscheduled)} draggedTileID={boardObject.draggedID}
                        isDraggedOver={boardObject.overColumn === 'unscheduled'}/>
          <KanbanColumn type="inProgress" tasks={filterBySearch(sortedTasks.inProgress)} draggedTileID={boardObject.draggedID}
                        isDraggedOver={boardObject.overColumn === 'inProgress'}/>
          <KanbanColumn type="done" tasks={filterBySearch(sortedTasks.done)} draggedTileID={boardObject.draggedID}
                        isDraggedOver={boardObject.overColumn === 'done'}/>
          <DragOverlay dropAnimation={dropAnimation}>
            {task && <TaskCard task={task} progress={task.progress}/>}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  )
}
