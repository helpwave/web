import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/hightide'
import {
  CreateTaskTemplateRequest,
  CreateTaskTemplateSubTaskRequest,
  DeleteTaskTemplateRequest,
  DeleteTaskTemplateSubTaskRequest,
  GetAllTaskTemplatesRequest, UpdateTaskTemplateRequest,
  UpdateTaskTemplateSubTaskRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/task_template_svc_pb'
import type { TaskTemplateDTO, TaskTemplateFormType } from '../../types/tasks/tasks_templates'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import type { SubTaskDTO } from '../../types/tasks/task'

type QueryKey = 'personalTaskTemplates' | 'wardTaskTemplates'

export const useWardTaskTemplateQuery = (wardId?: string) => {
  return useQuery({
    queryKey: ['wardTaskTemplates', wardId],
    queryFn: async () => {
      let wardTaskTemplates: TaskTemplateDTO[] = []
      if (wardId !== undefined) {
        const req = new GetAllTaskTemplatesRequest()
        req.setWardId(wardId)
        const res = await APIServices.taskTemplates.getAllTaskTemplates(req, getAuthenticatedGrpcMetadata())
        wardTaskTemplates = res.getTemplatesList().map((template) => ({
          id: template.getId(),
          wardId,
          name: template.getName(),
          notes: template.getDescription(),
          subtasks: template.getSubtasksList().map((subtask) => ({
            id: subtask.getId(),
            name: subtask.getName(),
            isDone: false
          })),
          isPublicVisible: template.getIsPublic()
        }))
        return wardTaskTemplates
      }

      return wardTaskTemplates
    },
  })
}

type UseAllTaskTemplatesByCreatorProps = {
  createdBy?: string,
  onSuccess: (data: TaskTemplateDTO[]) => void,
  type: QueryKey,
}
export const useAllTaskTemplatesByCreator = ({
  createdBy,
  onSuccess = noop,
  type = 'wardTaskTemplates'
}: UseAllTaskTemplatesByCreatorProps) => {
  const queryKey = type
  const onlyPrivate = type === 'personalTaskTemplates'
  return useQuery({
    queryKey: [queryKey, createdBy],
    queryFn: async () => {
      let personalTaskTemplates: TaskTemplateDTO[] = []
      if (createdBy !== undefined) {
        const req = new GetAllTaskTemplatesRequest()
        req.setCreatedBy(createdBy)
        req.setPrivateOnly(onlyPrivate)
        const res = await APIServices.taskTemplates.getAllTaskTemplates(req, getAuthenticatedGrpcMetadata())

        personalTaskTemplates = res.getTemplatesList().map((template) => ({
          id: template.getId(),
          name: template.getName(),
          notes: template.getDescription(),
          subtasks: template.getSubtasksList().map((subtask) => ({
            id: subtask.getId(),
            name: subtask.getName(),
            isDone: false
          })),
          isPublicVisible: template.getIsPublic()
        }))
        return personalTaskTemplates
      }
      return personalTaskTemplates
    },
    onSuccess
  })
}

export const usePersonalTaskTemplateQuery = (createdBy?: string, onSuccess: (data: TaskTemplateDTO[]) => void = noop) => {
  return useAllTaskTemplatesByCreator({ createdBy, onSuccess, type: 'personalTaskTemplates' })
}

export const useUpdateMutation = (queryKey: QueryKey, setTemplate: (taskTemplate?: TaskTemplateDTO) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (templateForm: TaskTemplateFormType) => {
      const updateTaskTemplate = new UpdateTaskTemplateRequest()

      const taskTemplate = templateForm.template

      updateTaskTemplate.setName(taskTemplate.name)
      updateTaskTemplate.setDescription(taskTemplate.notes)
      updateTaskTemplate.setId(taskTemplate.id)

      const updateSubtaskTemplate = new UpdateTaskTemplateSubTaskRequest()
      const createSubTaskTemplate = new CreateTaskTemplateSubTaskRequest()
      const deleteSubtaskTaskTemplate = new DeleteTaskTemplateSubTaskRequest()

      if (templateForm.deletedSubtaskIds) {
        for (const id of templateForm.deletedSubtaskIds) {
          if (!id) {
            continue
          }
          deleteSubtaskTaskTemplate.setId(id)
          await APIServices.taskTemplates.deleteTaskTemplateSubTask(deleteSubtaskTaskTemplate, getAuthenticatedGrpcMetadata())
        }
      }

      for (const subtask of taskTemplate.subtasks) {
        // create new subtasks
        if (!subtask.id) {
          createSubTaskTemplate.setName(subtask.name)
          createSubTaskTemplate.setTaskTemplateId(taskTemplate.id)

          const res = await APIServices.taskTemplates.createTaskTemplateSubTask(createSubTaskTemplate, getAuthenticatedGrpcMetadata())
          subtask.id = res.getId()

          continue
        }

        // update subtask
        updateSubtaskTemplate.setName(subtask.name)
        updateSubtaskTemplate.setSubtaskId(subtask.id)

        await APIServices.taskTemplates.updateTaskTemplateSubTask(updateSubtaskTemplate, getAuthenticatedGrpcMetadata())
      }

      // update task template
      const res = await APIServices.taskTemplates.updateTaskTemplate(updateTaskTemplate, getAuthenticatedGrpcMetadata())
      const newTaskTemplate: TaskTemplateDTO = { ...taskTemplate, ...res }

      templateForm.deletedSubtaskIds = []
      setTemplate(newTaskTemplate)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousTaskTemplates = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey])
      queryClient.setQueryData<TaskTemplateDTO[]>(
        [queryKey],
        (old) => old
)
      return { previousTaskTemplates }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousTaskTemplates)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).catch(console.error)
    }
  })
}

export const useCreateMutation = (wardId: string, queryKey: QueryKey, setTemplate: (taskTemplate: TaskTemplateDTO | undefined) => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskTemplate: TaskTemplateDTO) => {
      const createTaskTemplate = new CreateTaskTemplateRequest()

      createTaskTemplate.setName(taskTemplate.name)
      createTaskTemplate.setDescription(taskTemplate.notes)
      createTaskTemplate.setSubtasksList(taskTemplate.subtasks.map((cSubtask) => {
        const subTask = new CreateTaskTemplateRequest.SubTask()
        subTask.setName(cSubtask.name)
        return subTask
      }))

      if (wardId) {
        createTaskTemplate.setWardId(wardId)
      }

      const res = await APIServices.taskTemplates.createTaskTemplate(createTaskTemplate, getAuthenticatedGrpcMetadata())
      const newTaskTemplate: TaskTemplateDTO = { ...taskTemplate, ...res }

      setTemplate(newTaskTemplate)
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousTaskTemplate)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousTaskTemplate = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey])
      queryClient.setQueryData<TaskTemplateDTO[]>([queryKey], (old) => old)
      return { previousTaskTemplate }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).catch(console.error)
    },
  })
}

export const useDeleteMutation = (queryKey: QueryKey, setTemplate: (task?: TaskTemplateDTO) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskTemplate: TaskTemplateDTO) => {
      const deleteTaskTemplate = new DeleteTaskTemplateRequest()
      deleteTaskTemplate.setId(taskTemplate.id)
      await APIServices.taskTemplates.deleteTaskTemplate(deleteTaskTemplate, getAuthenticatedGrpcMetadata())

      setTemplate(undefined)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousTaskTemplate = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey])
      queryClient.setQueryData<TaskTemplateDTO[]>(
        [queryKey],
        (old) => old
)
      return { previousTaskTemplate }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousTaskTemplate)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).catch(console.error)
    },
  })
}

export const useSubTaskTemplateDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtaskId: string) => {
      const deleteSubtaskTaskTemplate = new DeleteTaskTemplateSubTaskRequest()
      deleteSubtaskTaskTemplate.setId(subtaskId)
      await APIServices.taskTemplates.deleteTaskTemplateSubTask(deleteSubtaskTaskTemplate, getAuthenticatedGrpcMetadata())
      queryClient.invalidateQueries(['personalTaskTemplates']).catch(console.error)
      callback()
      return deleteSubtaskTaskTemplate.toObject()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['personalTaskTemplates'] }).catch(console.error)
    },
  })
}

export const useSubTaskTemplateUpdateMutation = (callback: (subtask: SubTaskDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtask: SubTaskDTO) => {
      const updateSubtaskTemplate = new UpdateTaskTemplateSubTaskRequest()
      updateSubtaskTemplate.setName(subtask.name)
      updateSubtaskTemplate.setSubtaskId(subtask.id)
      await APIServices.taskTemplates.updateTaskTemplateSubTask(updateSubtaskTemplate, getAuthenticatedGrpcMetadata())
      const newSubtask: SubTaskDTO = { ...subtask }
      queryClient.invalidateQueries(['wardTaskTemplates']).catch(console.error)
      callback(newSubtask)
      return updateSubtaskTemplate.toObject()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['personalTaskTemplates'] }).catch(console.error)
    },
  })
}

export const useSubTaskTemplateAddMutation = (taskTemplateId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtask: SubTaskDTO) => {
      const createSubTaskTemplate = new CreateTaskTemplateSubTaskRequest()
      createSubTaskTemplate.setName(subtask.name)
      createSubTaskTemplate.setTaskTemplateId(taskTemplateId)
      await APIServices.taskTemplates.createTaskTemplateSubTask(createSubTaskTemplate, getAuthenticatedGrpcMetadata())

      queryClient.invalidateQueries(['wardTaskTemplates']).catch(console.error)
      return createSubTaskTemplate.toObject()
    },
  })
}
