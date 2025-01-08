import type { SelectProps } from '@helpwave/common/components/user-input/Select'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { tx } from '@helpwave/common/twind'
import { SearchableSelect } from '@helpwave/common/components/user-input/SearchableSelect'
import {
  usePersonalTaskTemplateQuery
} from '@helpwave/api-services/mutations/tasks/task_template_mutations'
import type { TaskTemplateDTO } from '@helpwave/api-services/types/tasks/tasks_templates'
import { tw } from '@twind/core'
import { CircleCheck, Plus } from 'lucide-react'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'

export type TaskTemplateSelectTranslationType = {
  subtasks: (amount: number) => string
}

const defaultTaskTemplateTranslationSelectTranslation: Record<Languages, TaskTemplateSelectTranslationType> = {
  en: {
    subtasks: amount => `${amount} ${amount === 1 ? 'Task' : 'Tasks'}`
  },
  de: {
    subtasks: amount => `${amount} ${amount === 1 ? 'Task' : 'Tasks'}`
  }
}

export type TaskTemplateSelectProps = Omit<SelectProps<TaskTemplateDTO>, 'options'>

/**
 * A Select component for picking an TaskTemplate
 */
export const TaskTemplateSelect = ({
  value,
  className,
  isHidingCurrentValue = false,
  onChange,
  ...selectProps
} : PropsForTranslation<TaskTemplateSelectTranslationType, TaskTemplateSelectProps>) => {
  const translate = useTranslation(defaultTaskTemplateTranslationSelectTranslation)
  const { user } = useAuth()
  const { data, isLoading, isError } = usePersonalTaskTemplateQuery(user?.id) // TODO change to get all templates

  return (
    <LoadingAndErrorComponent
      isLoading={isLoading}
      hasError={isError}
    >
      <SearchableSelect
        // TODO update later with avatar of TaskTemplate
        value={data?.find(template => template.id === value?.id)}
        options={(data ?? []).map(value => ({
          value,
          label: (
            <div className={tw('hover:text-hw-primary-400 flex flex-row gap-x-2 justify-between items-center')}>
              <div className={tw('flex flex-col gap-y-1')}>
                <span className={tw('text-lg font-semibold')}>{value.name}</span>
                <div className={tw('flex flex-row gap-x-1 items-center !text-gray-400')}>
                  <CircleCheck size={18}/>
                  <span className={tw('text-sm')}>{translate.subtasks(value.subtasks.length)}</span>
                </div>
              </div>
              <Plus/>
            </div>
          )
        }))}
        isHidingCurrentValue={isHidingCurrentValue}
        className={tx('w-full', className)}
        searchMapping={value => [value.value.name, value.value.notes]}
        onChange={(template) => {
          onChange(template)
        }}
        {...selectProps}
      />
    </LoadingAndErrorComponent>
  )
}
