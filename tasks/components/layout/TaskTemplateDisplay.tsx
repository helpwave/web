import { useRouter } from 'next/router'
import type { Translation } from '@helpwave/hightide'
import { type PropsForTranslation, SelectUncontrolled, useTranslation } from '@helpwave/hightide'
import type { TaskTemplateDTO } from '@helpwave/api-services/types/tasks/tasks_templates'
import { AddCard } from '../cards/AddCard'
import { TaskTemplateCard } from '../cards/TaskTemplateCard'
import clsx from 'clsx'
import { ColumnTitle } from '@/components/ColumnTitle'
import { useWardOverviewsQuery } from '@helpwave/api-services/mutations/tasks/ward_mutations'

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

export type TaskTemplateDisplayProps = {
  wardId: string,
  selectedId: string,
  onSelectChange: (taskTemplate: TaskTemplateDTO | undefined) => void,
  taskTemplates: TaskTemplateDTO[],
  variant: 'wardTemplates' | 'personalTemplates',
}

/**
 * A column for showing TaskTemplates either for Ward or Private templates
 */
export const TaskTemplateDisplay = ({
                                      overwriteTranslation,
                                      wardId,
                                      selectedId,
                                      onSelectChange,
                                      taskTemplates,
                                      variant,
                                    }: PropsForTranslation<TaskTemplateDisplayTranslation, TaskTemplateDisplayProps>) => {
  const translation = useTranslation([defaultTaskTemplateDisplayTranslation], overwriteTranslation)

  const router = useRouter()
  const { data: wards, isLoading: isLoadingWards, isError: isErrorWards } = useWardOverviewsQuery()

  return (
    <div className="py-4 px-6 @container">
      <ColumnTitle
        title={variant === 'personalTemplates' ? translation('personalTaskTemplates') : translation('wardTaskTemplates')}
        actions={(
          <SelectUncontrolled<string>
            value={variant === 'personalTemplates' ? 'personal' : wardId}
            options={[...(wards ?? []).map(value => ({
              label: value.name,
              value: value.id,
              searchTags: [value.name]
            })),
              {
                label: translation('personal'),
                value: 'personal',
                searchTags: [translation('personal')]
              }
            ]}
            onChange={value => {
              const url = value === 'personal' ? `/templates` : `/ward/${value}/templates`
              router.push(url).catch(console.error)
            }}
            disabled={isLoadingWards || isErrorWards}
            className="min-w-40"
          />
        )}
        containerClassName="mb-2"
      />
      <div className="grid @max-md:grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-6">
        {taskTemplates.map(taskTemplate => (
          <TaskTemplateCard
            key={taskTemplate.id}
            name={taskTemplate.name}
            subtaskCount={taskTemplate.subtasks.length}
            isSelected={selectedId === taskTemplate.id}
            onEditClick={() => onSelectChange(taskTemplate)}
            onClick={() => onSelectChange(taskTemplate)}
            className="!min-h-17 !h-auto"
          />
        ))}
        <AddCard
          onClick={() => onSelectChange(undefined)}
          className={clsx(
            '!min-h-17 !h-auto',
            {
              'border-primary border-2': selectedId === ''
            }
          )}
          text={translation('addNewTaskTemplate')}
        />
      </div>
    </div>
  )
}
