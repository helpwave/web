import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

type PillLabelTranslation = {
  text: string
}

export type TaskStateInformation = { colorLabel: string, translation: Record<Languages, PillLabelTranslation> }

const TaskState = {
  unscheduled: {
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
  state?: TaskStateInformation
}

/**
 * A Label for showing a TaskState's information like the state name and the count of Tasks in this state
 */
const PillLabel = ({
  language,
  count = 0,
  state = TaskState.unscheduled
}: PropsWithLanguage<PillLabelTranslation, PillLabelProps>) => {
  const translation = useTranslation(language, state.translation)
  return (
    <div className={tw(`flex flex-row pl-2 pr-3 py-1 rounded-lg justify-between
       bg-${state.colorLabel}-background text-${state.colorLabel}-text text-sm`)}>
      <div className={tw(`flex flex-row items-center text-${state.colorLabel}-text`)}>
        <div className={tw(`rounded-full w-2 h-2 bg-${state.colorLabel}-accent`)}/>
        <div className={tw('w-2')}/>
        {translation.text}
      </div>
      {count}
    </div>
  )
}

export { PillLabel, TaskState }
