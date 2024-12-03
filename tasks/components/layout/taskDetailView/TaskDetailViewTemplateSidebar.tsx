import { tw } from '@helpwave/common/twind'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import type { TaskDTO } from '@helpwave/api-services/types/tasks/task'
import type { TaskTemplateDTO } from '@helpwave/api-services/types/tasks/tasks_templates'
import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  usePersonalTaskTemplateQuery,
  useWardTaskTemplateQuery
} from '@helpwave/api-services/mutations/tasks/task_template_mutations'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { TaskTemplateListColumn } from '@/components/TaskTemplateListColumn'

type Props = {
  isCreating: boolean,
  task: TaskDTO,
  wardId: string,
  handleOnTileClick: (taskDTO: TaskDTO) => void
};

export const TaskDetailViewTemplateSidebar = ({
  isCreating,
  task,
  wardId,
  handleOnTileClick,
}: Props) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<TaskTemplateDTO['id'] | undefined>(undefined)
  const router = useRouter()

  const { user } = useAuth()
  const {
    data: personalTaskTemplatesData,
    isLoading: personalTaskTemplatesIsLoading,
    error: personalTaskTemplatesError
  } = usePersonalTaskTemplateQuery(user?.id)
  const {
    data: wardTaskTemplatesData,
    isLoading: wardTaskTemplatesIsLoading,
    error: wardTaskTemplatesError
  } = useWardTaskTemplateQuery(wardId)

  const taskTemplates =
    personalTaskTemplatesData && wardTaskTemplatesData
      ? [
        ...(personalTaskTemplatesData.map((taskTemplate) => ({
          taskTemplate,
          type: 'personal' as const
        }))),
        ...(wardTaskTemplatesData.map((taskTemplate) => ({
          taskTemplate,
          type: 'ward' as const
        })))
      ].sort((a, b) => a.taskTemplate.name.localeCompare(b.taskTemplate.name))
      : []

  return isCreating ? (
    <div
      className={tw('fixed flex flex-col w-[250px] -translate-x-[250px] -translate-y-4 overflow-hidden p-4 pb-0 bg-gray-100 rounded-l-xl h-full')}
    >
      {personalTaskTemplatesData && wardTaskTemplatesData && (
        <TaskTemplateListColumn
          templates={taskTemplates}
          activeId={selectedTemplateId}
          onTileClick={({ id, name, notes, subtasks }) => {
            setSelectedTemplateId(id)
            handleOnTileClick({ ...task, name, notes, subtasks })
          }}
          onColumnEditClick={() => router.push(`/ward/${wardId}/templates`)}
        />
      )}
      {(personalTaskTemplatesIsLoading || wardTaskTemplatesIsLoading || personalTaskTemplatesError || wardTaskTemplatesError)
        ?
        <LoadingAnimation />
        : null}
    </div>
  ) : null
}
