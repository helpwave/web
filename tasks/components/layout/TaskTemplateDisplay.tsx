import { useRouter } from 'next/router'
import type {
  Translation } from '@helpwave/hightide'
import {
  LoadingAndErrorComponent,
  type PropsForTranslation,
  Select,
  SelectOption,
  useTranslation
} from '@helpwave/hightide'
import { AddCard } from '../cards/AddCard'
import { TaskTemplateCard } from '../cards/TaskTemplateCard'
import clsx from 'clsx'
import { ColumnTitle } from '@/components/ColumnTitle'
import { useWardOverviewsQuery } from '@helpwave/api-services/mutations/tasks/ward_mutations'
import { useContext } from 'react'
import { emptyTaskTemplate, TaskTemplateContext } from '@/pages/templates'
import type { TaskTemplateDTO } from '@helpwave/api-services/types/tasks/tasks_templates'

export type TaskTemplateDisplayTranslation = {
  addNewTaskTemplate: string,
  personalTaskTemplates: string,
  personal: string,
  wardTaskTemplates: string,
}

const defaultTaskTemplateDisplayTranslation: Translation<TaskTemplateDisplayTranslation> = {
  en: {
    addNewTaskTemplate: 'New template',
    personalTaskTemplates: 'Personal Task Templates',
    personal: 'Personal',
    wardTaskTemplates: 'Ward Task Templates'
  },
  de: {
    addNewTaskTemplate: 'Neue Vorlage',
    personalTaskTemplates: 'Meine Vorlagen',
    personal: 'Persönliche',
    wardTaskTemplates: 'Stations Vorlagen'
  }
}

export type TaskTemplateDisplayProps = object

/**
 * A column for showing TaskTemplates either for Ward or Private templates
 */
export const TaskTemplateDisplay = ({
                                      overwriteTranslation,
                                    }: PropsForTranslation<TaskTemplateDisplayTranslation, TaskTemplateDisplayProps>) => {
  const translation = useTranslation([defaultTaskTemplateDisplayTranslation], overwriteTranslation)
  const { state, updateContext } = useContext(TaskTemplateContext)
  const { isLoading, template, wardId, hasError, templates } = state

  const router = useRouter()
  const { data: wards, isLoading: isLoadingWards, isError: isErrorWards } = useWardOverviewsQuery()

  const isShowingWardTemplates = !!wardId
  const selectedId = template.id

  const onChangeSelected = (taskTemplate: TaskTemplateDTO) => {
    updateContext(prevState => ({
      ...prevState,
      template: taskTemplate,
      hasChanges: false,
      isValid: !!taskTemplate.id,
      deletedSubtaskIds: []
    }))
  }

  return (
    <div className="py-4 px-6 @container">
      <ColumnTitle
        title={!isShowingWardTemplates ? translation('personalTaskTemplates') : translation('wardTaskTemplates')}
        actions={(
          // TODO change to a menu
          <Select
            value={!isShowingWardTemplates ? 'personal' : wardId}
            onValueChanged={value => {
              const url = value === 'personal' ? `/templates` : `/ward/${value}/templates`
              router.push(url).catch(console.error)
            }}
            disabled={isLoadingWards || isErrorWards}
            buttonProps={{
              className: 'min-w-40'
            }}

          >
            {wards?.map(value => (
              <SelectOption key={value.id} value={value.id}>
                {value.name}
              </SelectOption>
            ))}
            <SelectOption key="personal" value="personal">
              {translation('personal')}
            </SelectOption>
          </Select>
        )}
        containerClassName="mb-2"
      />
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={hasError}
        className="min-h-40"
      >
        <div className="grid @max-md:grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-6">
          {templates && templates.map(taskTemplate => (
            <TaskTemplateCard
              key={taskTemplate.id}
              name={taskTemplate.name}
              subtaskCount={taskTemplate.subtasks.length}
              isSelected={selectedId === taskTemplate.id}
              onEditClick={() => onChangeSelected(taskTemplate)}
              onClick={() => onChangeSelected(taskTemplate)}
              className="!min-h-17 !h-auto"
            />
          ))}
          <AddCard
            onClick={() => onChangeSelected(emptyTaskTemplate)}
            className={clsx(
              '!min-h-17 !h-auto',
              {
                'border-primary border-2': selectedId === ''
              }
            )}
            text={translation('addNewTaskTemplate')}
          />
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
