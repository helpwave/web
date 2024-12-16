import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useState } from 'react'
import { shortcut, tw, tx } from '@twind/core'
import { ChevronDown, ChevronRight, ChevronUp, Plus } from 'lucide-react'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'
import { useTasksByPatientQuery, useTaskUpdateMutation } from '@helpwave/api-services/mutations/tasks/task_mutations'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import { Chip } from '@helpwave/common/components/ChipList'
import { ProgressIndicator } from '@helpwave/common/components/ProgressIndicator'
import { noop } from '@helpwave/common/util/noop'
import type { TaskDTO } from '@helpwave/api-services/types/tasks/task'

export type TaskTableTranslation = {
  open: string,
  closed: string,
  tasks: string,
  taskName: string,
  subtasks: string,
  addTask: string,
  addTaskGroup: string,
  dueDate: string,
  assignee: string,
  showAll: string,
  showLess: string,
  noTasks: string
}

export const defaultTaskTableTranslation: Record<Languages, TaskTableTranslation> = {
  en: {
    open: 'Open',
    closed: 'Closed',
    tasks: 'Tasks',
    taskName: 'Task Name',
    subtasks: 'Subtasks',
    addTask: 'Add Task',
    addTaskGroup: 'Add Task Group',
    dueDate: 'Due date',
    assignee: 'Assignee',
    showAll: 'Show All',
    showLess: 'Show Less',
    noTasks: 'No Tasks'
  },
  de: {
    open: 'Offene',
    closed: 'Geschlossene',
    tasks: 'Tasks',
    taskName: 'Task Name',
    subtasks: 'Subtasks',
    addTask: 'Task hinzufügen',
    addTaskGroup: 'Task Group hinzufügen',
    dueDate: 'Fälligkeitsdatum',
    assignee: 'Zugewiesen',
    showAll: 'Alle anzeigen',
    showLess: 'Weniger anzeigen',
    noTasks: 'Keine Tasks'
  },
}

export type TaskTableType = 'openTasks' | 'closedTasks'

export type TaskTableProps = {
  type: TaskTableType,
  patientId: string,
  onAddTaskClick?: () => void,
  onTaskClick?: (task: TaskDTO) => void,
  maximumTasksShown: number,
  className?: string
}

export const TaskTable = ({
  overwriteTranslation,
  type,
  patientId,
  onTaskClick = noop,
  onAddTaskClick = noop,
  maximumTasksShown = 5,
  className
}: PropsForTranslation<TaskTableTranslation, TaskTableProps>) => {
  const translation = useTranslation(defaultTaskTableTranslation, overwriteTranslation)
  const [isOpen, setIsOpen] = useState(true)
  const [isShowingAll, setIsShowingAll] = useState(false)
  const { data } = useTasksByPatientQuery(patientId)
  const updateTaskMutation = useTaskUpdateMutation()

  const padding = shortcut('p-2 first:pl-4 last:pr-4')
  const border = shortcut('border-b-2 first:border-l-2 last:border-r-2')
  const firstRowBorder = shortcut('border-t-2 first:rounded-tl-lg last:rounded-tr-lg')
  const lastRowBorder = shortcut('first:rounded-bl-lg last:rounded-br-lg')
  const headerStyle = tw(`${padding} ${border} ${firstRowBorder}`)

  const filteredTasks = (data ?? []).filter(value => (value.status === 'todo' && type === 'openTasks') || (value.status === 'done' && type === 'closedTasks'))
  const shownTasks = isShowingAll ? filteredTasks : filteredTasks.slice(0, maximumTasksShown)
  const hasMoreTasks = filteredTasks.length > maximumTasksShown
  const isShowingAddTasks = type === 'openTasks' && filteredTasks.length < maximumTasksShown
  const isShowingNoTasks = type === 'closedTasks' && filteredTasks.length === 0

  return (
    <div className={tx('flex flex-col', className)}>
      <div className={tw('flex flex- justify-between items-center')}>
        <button className={tw('flex flex-row gap-x-2 items-center')} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronDown/> : <ChevronRight/>}
          <Span
            type="subsectionTitle">{`${type === 'openTasks' ? translation.open : translation.closed} ${translation.tasks}`}</Span>
        </button>
        {type === 'openTasks' && (
          <div className={tw('flex flex-row gap-x-4 items-center')}>
            <Button className={tw('flex flex-row gap-x-1 items-center')} color="hw-primary" variant="tonal-opaque">
              {/* TODO make this its own component with a select */}
              {translation.addTaskGroup}
              <ChevronDown/>
            </Button>
            <Button className={tw('flex flex-row gap-x-1 items-center')} color="hw-primary" variant="background"
                    onClick={onAddTaskClick}>
              <Plus/>
              {translation.addTask}
            </Button>
          </div>
        )}
      </div>
      {isOpen && (
        <table className={tw('mt-2 table-fixed w-full border-separate border-spacing-0')}>
          <thead>
          <tr className={tw('bg-hw-secondary-100 font-bold text-gray-500 text-left')}>
            <th className={tw(`w-[56px] ${headerStyle}`)}/>
            <th className={tw(`${headerStyle}`)}>{translation.taskName}</th>
            <th className={tw(`w-24 ${headerStyle}`)}>{translation.subtasks}</th>
            <th className={tw(`w-32 ${headerStyle}`)}>{translation.dueDate}</th>
            <th className={tw(`w-32 ${headerStyle}`)}>{translation.assignee}</th>
          </tr>
          </thead>
          <tbody>
          {shownTasks.map((value, index) => {
            const needsRoundedBorders = !hasMoreTasks && !isShowingAddTasks && index === shownTasks.length - 1
            const tdStyle = tx(`${padding} ${border}`, { [lastRowBorder]: needsRoundedBorders })
            return (
              <tr key={value.id} onClick={() => onTaskClick(value)} className={tx('cursor-pointer hover:bg-gray-50')}>
                <td
                  className={tdStyle}>
                  <Checkbox
                    checked={value.status === 'done'}
                    onChange={checked => updateTaskMutation.mutate({ ...value, status: checked ? 'todo' : 'done' })}
                    className={tx('rounded-full')}
                    color="hw-positive"
                    size={32}
                  />
                </td>
                <td className={tdStyle}>
                  <div className={tw(`flex flex-col gap-y-1`)}>
                    <Span type="subsectionTitle">{value.name}</Span>
                    <div className={tw('flex flex-wrap gap-y-1 gap-x-2')}>
                      {/* TODO remove these dummy tags */}
                      {['name', 'something'].map((chip, index) => (
                        <Chip key={index} color="darkPrimary" className={tw('!p-1 !font-semibold !text-sm')}>
                          <Span>{chip}</Span>
                        </Chip>
                      ))}
                      <Chip color="hw-grayscale" className={tw('!p-1')}><Plus size={20}/></Chip>
                    </div>
                  </div>
                </td>
                <td className={tdStyle}>
                  <div className={tw('flex flex-col items-center')}>
                    {value.subtasks.length !== 0 ? (
                      <ProgressIndicator
                        progress={value.subtasks.filter(value1 => value1.isDone).length / value.subtasks.length}
                        size="big"
                      >
                        <Span className={tw('text-hw-primary-400 font-bold text-lg')}>
                          {value.subtasks.length}
                        </Span>
                      </ProgressIndicator>
                    ) : <Span>-</Span>}
                  </div>
                </td>
                <td className={tdStyle}>
                  {/* TODO use a better component to display the date */}
                  <Span
                    className={tw('w-full')}>{value.dueDate?.toISOString().substring(0, 16).replace('T', ', ') ?? '-'}</Span>
                </td>
                <td
                  className={tdStyle}>
                  { /* TODO load assignee here */}
                  <Span className={tw('!text-xs font-regular')}>{value.assignee}</Span>
                </td>
              </tr>
            )
          })}
          {isShowingAddTasks && (
            <tr onClick={onAddTaskClick} className={tw('cursor-pointer hover:bg-gray-50')}>
              <td className={tx(`${padding} ${border} rounded-bl-lg`)}>
                <Plus/>
              </td>
              <td className={tw(`${border}`)}>
                <div className={tw('flex flex-row gap-x-2')}>
                  {translation.addTask}
                </div>
              </td>
              <td colSpan={3} className={tx(`${padding} ${border}`)}/>
            </tr>
          )}
          {isShowingNoTasks && (
            <tr>
              <td colSpan={5} className={tw(`${padding}${border} rounded-b-lg`)}>
                <div className={tw(`flex flex-row justify-center gap-x-2`)}>
                  {translation.noTasks}
                </div>
              </td>
            </tr>
          )}
          {hasMoreTasks && (
            <tr onClick={() => setIsShowingAll(!isShowingAll)} className={tw('cursor-pointer hover:bg-gray-50')}>
              <td colSpan={5} className={tw(`${padding} ${border} rounded-b-lg`)}>
                <div className={tw('flex flex-row justify-center gap-x-2')}>
                  {isShowingAll ? <ChevronUp/> : <ChevronDown/>}
                  {isShowingAll ? translation.showLess : translation.showAll}
                </div>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      )}
    </div>
  )
}
