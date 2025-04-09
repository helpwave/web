import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import type { TaskStatus } from '@helpwave/api-services/types/tasks/task'

type PillLabelTranslation = {
  text: string,
}

export type TaskStateInformation = { colorLabel: string, translation: Record<Languages, PillLabelTranslation> }

const TaskState: Record<TaskStatus, TaskStateInformation> = {
  todo: {
    colorLabel: 'hw-label-1',
    translation: {
      en: { text: 'unscheduled' },
      de: { text: 'Nicht Geplant' }
    }
  },
  inProgress: {
    colorLabel: 'hw-label-2',
    translation: {
      en: { text: 'in progress' },
      de: { text: 'In Arbeit' }
    }
  },
  done: {
    colorLabel: 'hw-label-3',
    translation: {
      en: { text: 'done' },
      de: { text: 'Fertig' }
    }
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
  const state = TaskState[taskStatus]
  const translation = useTranslation(state.translation, overwriteTranslation)
  return (
    <div className={clsx(`flex flex-row pl-2 pr-3 py-1 rounded-lg justify-between items-center
       bg-${state.colorLabel}-100 text-${state.colorLabel}-800 text-sm`)}>
      <div className={clsx(`flex flex-row items-center text-${state.colorLabel}-800`)}>
        <div className={clsx(`rounded-full w-2 h-2 bg-${state.colorLabel}-400`)}/>
        <div className={clsx('w-2')}/>
        <span>{translation.text}</span>
      </div>
      {count ?? '-'}
    </div>
  )
}

export { PillLabel, TaskState }
