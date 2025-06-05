import clsx from 'clsx'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import type { TaskStatus } from '@helpwave/api-services/types/tasks/task'

type PillLabelTranslation = {
  text: string,
}


const mapping = {
  todo: {
    mainClassName: 'bg-tag-red-background text-tag-red-text',
    iconClassName: 'bg-tag-red-icon',
    translation: {
      en: { text: 'unscheduled' },
      de: { text: 'Nicht Geplant' }
    }
  },
  inProgress: {
    mainClassName: 'bg-tag-yellow-background text-tag-yellow-text',
    iconClassName: 'bg-tag-yellow-icon',
    translation: {
      en: { text: 'in progress' },
      de: { text: 'In Arbeit' }
    }
  },
  done: {
    mainClassName: 'bg-tag-green-background text-tag-green-text',
    iconClassName: 'bg-tag-green-icon',
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
  const state = mapping[taskStatus]
  const translation = useTranslation(state.translation, overwriteTranslation)
  return (
    <div className={clsx(`row items-center justify-between pl-2 pr-3 py-1 rounded-lg text-sm`, state.mainClassName)}>
      <div className="row gap-x-2 items-center">
        <div className={clsx(`rounded-full w-2 h-2`, state.iconClassName)}/>
        <span>{translation.text}</span>
      </div>
      {count ?? '-'}
    </div>
  )
}

export { PillLabel }
