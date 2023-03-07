import { tw } from '@helpwave/common/twind/index'
import type { TaskStateInformation } from '../dataclasses/TaskState'
import { TaskState } from '../dataclasses/TaskState'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { FunctionComponent } from 'react'

type PillLabelTranslation = {
  unscheduled: string,
  inProgress: string,
  done: string
}

const defaultTranslation: Record<Languages, PillLabelTranslation> = {
  en: {
    unscheduled: 'unscheduled',
    inProgress: 'in progress',
    done: 'done'
  },
  de: {
    unscheduled: 'Nicht Geplant',
    inProgress: 'In Arbeit',
    done: 'Fertig'
  },
}

export type PillLabelProps = {
  count?: number,
  state?: TaskStateInformation
}

const PillLabel: FunctionComponent<PropsWithLanguage<PillLabelTranslation, PillLabelProps>> =
  (props) => {
    const translation = useTranslation(props.language, defaultTranslation)
    props.state ??= TaskState.unscheduled
    props.count ??= 0
    const translationMap: {[key:string]:string} = {
      unscheduled: translation.unscheduled,
      inProgress: translation.inProgress,
      done: translation.done
    }
    return (
      <div className={tw(`flex flex-row pl-2 pr-3 py-1 rounded-lg justify-between
       bg-${props.state.colorLabel}-background text-${props.state.colorLabel}-text text-sm`)}>
        <div className={tw(`flex flex-row items-center text-${props.state.colorLabel}-text`)}>
          <div className={tw(`rounded-full w-2 h-2 bg-${props.state.colorLabel}-accent`)} />
          <div className={tw('w-2')} />
          {translationMap[props.state.textID]}
        </div>
        {props.count}
      </div>
    )
  }

export { PillLabel }
