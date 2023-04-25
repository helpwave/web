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
import { KanbanColumn } from '../KanbanColumn'
import { TaskCard } from '../cards/TaskCard'
import { KanbanHeader } from '../KanbanHeader'
import { noop } from '@helpwave/common/components/user_input/Input'
import type { TaskDTO, TaskStatus } from '../../mutations/room_mutations'

export type KanbanBoardObject = {
  draggedID?: string,
  searchValue: string,
  overColumn?: string
}

export type SortedTasks = {
  unscheduled: TaskDTO[],
  inProgress: TaskDTO[],
  done: TaskDTO[]
}

type KanbanBoardProps = {
  sortedTasks: SortedTasks,
  onChange: (sortedTasks: SortedTasks) => void,
  boardObject: KanbanBoardObject,
  onBoardChange: (board: KanbanBoardObject) => void,
  onEditTask: (task: TaskDTO) => void,
  editedTaskID?: string
}

/**
 * A Kanbanboard for showing and changing tasks
 *
 * The State is managed by the parent component
 */
export const KanbanBoard = ({
  sortedTasks,
  boardObject,
  onBoardChange,
  onChange = noop,
  onEditTask,
  editedTaskID
}: KanbanBoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
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
    onBoardChange({ ...boardObject, draggedID: active.id as string })
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
    onChange({
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

    onBoardChange({ ...boardObject, overColumn })
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeColumn = findColumn(active.id as string)
    const overColumn = findColumn(over?.id as string)

    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return
    }

    const activeIndex = sortedTasks[activeColumn].findIndex(task => task.id === active.id)
    const overIndex = sortedTasks[overColumn].findIndex(task => task.id === over?.id)

    onBoardChange({ ...boardObject, draggedID: undefined, overColumn: undefined })
    if (activeIndex !== overIndex) {
      const newSortedTasks = {
        ...sortedTasks,
        [overColumn]: arrayMove(sortedTasks[overColumn], activeIndex, overIndex),
      }
      onChange(newSortedTasks)
    }
  }

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  }

  const task = boardObject.draggedID ?
      [...sortedTasks.unscheduled, ...sortedTasks.inProgress, ...sortedTasks.done].find(value => value && value.id === boardObject.draggedID)
    : null

  function filterBySearch(tasks: TaskDTO[]): TaskDTO[] {
    return tasks.filter(value => value.name.replaceAll(' ', '').toLowerCase().indexOf(boardObject.searchValue.replaceAll(' ', '').toLowerCase()) !== -1)
  }

  return (
    <div>
      <KanbanHeader
        searchValue={boardObject.searchValue}
        onSearchChange={text => onBoardChange({ ...boardObject, searchValue: text })}
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
            type="unscheduled"
            tasks={filterBySearch(sortedTasks.unscheduled)}
            draggedTileID={boardObject.draggedID ?? editedTaskID}
            isDraggedOver={boardObject.overColumn === 'unscheduled'}
            onEditTask={onEditTask}
          />
          <KanbanColumn
            type="inProgress"
            tasks={filterBySearch(sortedTasks.inProgress)}
            draggedTileID={boardObject.draggedID ?? editedTaskID}
            isDraggedOver={boardObject.overColumn === 'inProgress'}
            onEditTask={onEditTask}
          />
          <KanbanColumn
            type="done"
            tasks={filterBySearch(sortedTasks.done)}
            draggedTileID={boardObject.draggedID ?? editedTaskID}
            isDraggedOver={boardObject.overColumn === 'done'}
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
