import clsx from 'clsx'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import type { TaskStatus, TaskStatusTranslationType } from '@helpwave/api-services/types/tasks/task'
import { TaskStatusUtil } from '@helpwave/api-services/types/tasks/task'

type PillLabelTranslation = TaskStatusTranslationType

const mapping: Record<TaskStatus, { mainClassName: string, iconClassName: string }> = {
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
const PillLabel = ({
  overwriteTranslation,
  count,
  taskStatus = 'todo'
}: PropsForTranslation<PillLabelTranslation, PillLabelProps>) => {
  const state = mapping[taskStatus]
  const translation = useTranslation([TaskStatusUtil.translation], overwriteTranslation)
  return (
    <div className={clsx(`row items-center justify-between pl-2 pr-3 py-1 rounded-lg text-sm`, state.mainClassName)}>
      <div className="row gap-x-2 items-center">
        <div className={clsx(`rounded-full w-2 h-2`, state.iconClassName)}/>
        <span>{translation(taskStatus)}</span>
      </div>
      {count ?? '-'}
    </div>
  )
}

export { PillLabel }
