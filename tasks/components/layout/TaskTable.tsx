import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useState } from 'react'
import { tw, tx } from '@twind/core'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'
import { useTasksByPatientQuery, useTaskUpdateMutation } from '@helpwave/api-services/mutations/tasks/task_mutations'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import { Chip } from '@helpwave/common/components/ChipList'
import { ProgressIndicator } from '@helpwave/common/components/ProgressIndicator'

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
  showLess: string
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
    showLess: 'Show Less'
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
  },
}

export type TaskTableType = 'openTasks' | 'closedTasks'

export type TaskTableProps = {
  type: TaskTableType,
  patientId: string,
  className?: string
}

export const TaskTable = ({
  overwriteTranslation,
  type,
  patientId,
  className
}: PropsForTranslation<TaskTableTranslation, TaskTableProps>) => {
  const translation = useTranslation(defaultTaskTableTranslation, overwriteTranslation)
  const [isOpen, setIsOpen] = useState(true)
  const [isShowingAll, setIsShowingAll] = useState(false)
  const { data } = useTasksByPatientQuery(patientId)
  const updateTaskMutation = useTaskUpdateMutation()

  const padding = 'p-[8px]'
  const lastOrFirstPadding = '[16px]'
  const maximumTasksShown = 5
  const filteredTasks = (data ?? []).filter(value => (value.status === 'todo' && type === 'openTasks') || (value.status === 'done' && type === 'closedTasks'))
  const shownTasks = filteredTasks.slice(0, maximumTasksShown)
  const hasMoreTasks = filteredTasks.length > maximumTasksShown
  return (
    <div className={tx('flex flex-col', className)}>
      <div className={tw('flex flex- justify-between items-center')}>
        <button className={tw('flex flex-row gap-x-2')} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronDown/> : <ChevronUp/>}
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
            <Button className={tw('flex flex-row gap-x-1 items-center')} color="hw-primary" variant="background">
              <Plus/>
              {translation.addTask}
            </Button>
          </div>
        )}
      </div>
      <table className={tw('mt-2 table-fixed w-full border-separate border-spacing-0')}>
        <thead>
        <tr className={tw('bg-hw-secondary-50 font-bold text-gray-400 text-left')}>
          <th className={tw(`w-[56px] ${padding} pl-${lastOrFirstPadding} border-2 border-r-0 rounded-tl-lg`)}/>
          <th className={tw(`${padding} border-y-2`)}>{translation.taskName}</th>
          <th className={tw(`w-24 ${padding} border-y-2`)}>{translation.subtasks}</th>
          <th className={tw(`w-32 ${padding} border-y-2`)}>{translation.dueDate}</th>
          <th className={tw(`w-32 ${padding} pr-${lastOrFirstPadding} border-2 border-l-0 rounded-tr-lg`)}>{translation.assignee}</th>
        </tr>
        </thead>
        <tbody>
        {shownTasks.map((value, index) => (
          <tr key={value.id}>
            <td className={tx(`${padding} pl-${lastOrFirstPadding} border-b-2 border-l-2`, { 'rounded-bl-lg': !hasMoreTasks && index === shownTasks.length - 1 })}>
              <Checkbox
                checked={value.status === 'done'}
                onChange={checked => updateTaskMutation.mutate({ ...value, status: checked ? 'todo' : 'done' })}
                className={tx('rounded-full')}
                color="hw-positive"
                size={32}
              />
            </td>
            <td className={tw(`${padding}  border-b-2`)}>
              <div className={tw(`flex flex-col gap-y-1`)}>
                <Span type="subsectionTitle">{value.name}</Span>
                <div className={tw('flex flex-wrap gap-y-1 gap-x-2')}>
                  {['name', 'something'].map((chip, index) => (
                    <Chip key={index} color="darkPrimary" className={tw('!p-1 !font-semibold !text-sm')}>
                      <Span>{chip}</Span>
                    </Chip>
                  ))}
                  <Chip color="hw-grayscale" className={tw('!p-1')}><Plus size={20}/></Chip>
                </div>
              </div>
            </td>
            <td className={tw(`${padding} border-b-2`)}>
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
            <td className={tw(`${padding} border-b-2`)}>
              {/* TODO use a better component to display the date */}
              <Span className={tw('w-full')}>{value.dueDate?.toISOString().substring(0, 16).replace('T', ', ') ?? '-'}</Span>
            </td>
            <td className={tx(`${padding} border-b-2 border-r-2 box-border pr-${lastOrFirstPadding} `, { 'rounded-br-lg': !hasMoreTasks && index === shownTasks.length - 1 })}>
              { /* TODO load assignee here */}
              <Span className={tw('!text-xs font-regular')}>{value.assignee}</Span>
            </td>
          </tr>
        ))}
        {filteredTasks.length > maximumTasksShown && (
          <tr onClick={() => setIsShowingAll(!isShowingAll)}>
            <td colSpan={5} className={tw('border-b-2 border-x-2 rounded-b-lg')}>
              <div className={tw('flex flex-row gap-x-2')}>
                {isShowingAll ? <ChevronUp/> : <ChevronDown/>}
                {isShowingAll ? translation.showLess : translation.showAll}
              </div>
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  )
}
