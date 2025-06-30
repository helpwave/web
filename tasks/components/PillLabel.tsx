import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import { type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import type { TaskStatus, TaskStatusTranslation } from '@helpwave/api-services/types/tasks/task'
import { TaskStatusUtil } from '@helpwave/api-services/types/tasks/task'

//
// PillLabel
//

type PillLabelTranslation = TaskStatusTranslation

const defaultPillLabelTranslation: Translation<TaskStatusTranslation> = TaskStatusUtil.translation

const mapping = {
  todo: {
    mainClassName: 'bg-tag-red-background text-tag-red-text',
    iconClassName: 'bg-tag-red-icon',
  },
  inProgress: {
    mainClassName: 'bg-tag-yellow-background text-tag-yellow-text',
    iconClassName: 'bg-tag-yellow-icon',
  },
  done: {
    mainClassName: 'bg-tag-green-background text-tag-green-text',
    iconClassName: 'bg-tag-green-icon',
  },
} as const

export type PillLabelProps = {
  count?: number,
  taskStatus?: TaskStatus,
}

/**
 * A Label for showing a TaskState's information like the state name and the count of Tasks in this state
 */
export const PillLabel = ({
                            overwriteTranslation,
                            count,
                            taskStatus = 'todo'
                          }: PropsForTranslation<PillLabelTranslation, PillLabelProps>) => {
  const state = mapping[taskStatus]
  const translation = useTranslation(defaultPillLabelTranslation, overwriteTranslation)

  return (
    <div className={clsx(`row items-center justify-between pl-2 pr-3 py-1 rounded-lg text-sm`, state.mainClassName)}>
      <div className="row gap-x-2 items-center">
        <div className={clsx(`rounded-full w-2 h-2`, state.iconClassName)}/>
        <span>{translation[taskStatus]}</span>
      </div>
      {count ?? '-'}
    </div>
  )
}

//
// PillLabelsColumn
//

export type PillLabelsColumnProps = {
  unscheduledCount?: number,
  inProgressCount?: number,
  doneCount?: number,
}

/**
 * A column showing the all TaskStates with a PillLabel for each
 */
export const PillLabelsColumn = ({ unscheduledCount, inProgressCount, doneCount }: PillLabelsColumnProps) => {
  return (
    <div className="col gap-y-2">
      <PillLabel count={unscheduledCount} taskStatus="todo"/>
      <PillLabel count={inProgressCount} taskStatus="inProgress"/>
      <PillLabel count={doneCount} taskStatus="done"/>
    </div>
  )
}

//
// PillLabelBox
//

export type PillLabelBoxProps = {
  unscheduled: number,
  inProgress: number,
  done: number,
}

/**
 * A Label for showing all TaskState information like the state name and the count of all Tasks in this state.
 *
 * For each state unscheduled, in progress and done there will be a number
 */
export const PillLabelBox = ({ unscheduled, inProgress, done }: PillLabelBoxProps) => {
  const between = '0.25rem'
  const height = '0.75rem'
  const borderStyle = {
    borderTopWidth: height,
    borderBottomWidth: height,
    borderLeftWidth: between,
    borderRightWidth: between,
  }
  return (
    <div className="row gap-x-0 h-6">
      <div
        className="row rounded-l-md pl-2 pr-1 items-center bg-tag-red-background text-tag-red-text"
      >
        <div className="rounded-full w-2 h-2 bg-tag-red-icon mr-1"/>
        {unscheduled}
      </div>
      <div
        className="w-0 h-0 border-solid border-r-transparent border-b-transparent border-tag-red-background"
        style={borderStyle}
      />
      <div
        className="w-0 h-0 border-tag-yellow-background border-solid border-l-transparent border-t-transparent"
        style={borderStyle}
      />
      <div className="row px-1 items-center bg-tag-yellow-background text-tag-yellow-text">
        <div className="rounded-full w-2 h-2 mr-1 bg-tag-yellow-icon"/>
        {inProgress}
      </div>
      <div
        className="w-0 h-0 border-tag-yellow-background border-solid border-r-transparent border-b-transparent"
        style={borderStyle}
      />
      <div
        className="w-0 h-0 border-tag-green-background border-solid border-l-transparent border-t-transparent"
        style={borderStyle}
      />
      <div
        className="row bg-tag-green-background rounded-r-md pl-1 pr-2 items-center text-tag-green-text">
        <div className="rounded-full w-2 h-2 bg-tag-green-icon mr-1"/>
        {done}
      </div>
    </div>
  )
}
