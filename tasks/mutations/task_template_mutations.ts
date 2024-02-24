import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/components/user-input/Input'
import {
  CreateTaskTemplateRequest,
  CreateTaskTemplateSubTaskRequest,
  DeleteTaskTemplateRequest,
  DeleteTaskTemplateSubTaskRequest,
  GetAllTaskTemplatesByCreatorRequest,
  GetAllTaskTemplatesByWardRequest, UpdateTaskTemplateRequest, UpdateTaskTemplateSubTaskRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/task_template_svc_pb'
import type { SubTaskDTO } from './task_mutations'
import { getAuthenticatedGrpcMetadata, taskTemplateService } from '@/utils/grpc'
import type { TaskTemplateFormType } from '@/pages/templates'
import SubTask = CreateTaskTemplateRequest.SubTask // TODO: what even is this syntax???

export type TaskTemplateDTO = {
  wardId?: string,
  id: string,
  name: string,
  notes: string,
  subtasks: {
    isDone: boolean,
    id: string,
    name: string
  }[],
  isPublicVisible: boolean
}

type QueryKey = 'personalTaskTemplates' | 'wardTaskTemplates'

export const useWardTaskTemplateQuery = (wardId?: string, onSuccess: (data: TaskTemplateDTO[]) => void = noop) => {
  return useQuery({
    queryKey: ['wardTaskTemplates', wardId],
    queryFn: async () => {
      let wardTaskTemplates: TaskTemplateDTO[] = []
      if (wardId !== undefined) {
        const req = new GetAllTaskTemplatesByWardRequest()
        req.setWardId(wardId)
        const res = await taskTemplateService.getAllTaskTemplatesByWard(req, getAuthenticatedGrpcMetadata())
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
    onSuccess
  })
}

type UseAllTaskTemplatesByCreatorProps = {
  createdBy?: string,
  onSuccess: (data: TaskTemplateDTO[]) => void,
  type: QueryKey
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
        const req = new GetAllTaskTemplatesByCreatorRequest()
        req.setCreatedBy(createdBy)
        req.setPrivateOnly(onlyPrivate)
        const res = await taskTemplateService.getAllTaskTemplatesByCreator(req, getAuthenticatedGrpcMetadata())

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

export const useUpdateMutation = (queryKey: QueryKey, setTemplate: (taskTemplate: TaskTemplateDTO | undefined) => void) => {
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
          await taskTemplateService.deleteTaskTemplateSubTask(deleteSubtaskTaskTemplate, getAuthenticatedGrpcMetadata())
        }
      }

      for (const subtask of taskTemplate.subtasks) {
        // create new subtasks
        if (!subtask.id) {
          createSubTaskTemplate.setName(subtask.name)
          createSubTaskTemplate.setTaskTemplateId(taskTemplate.id)

          const res = await taskTemplateService.createTaskTemplateSubTask(createSubTaskTemplate, getAuthenticatedGrpcMetadata())
          subtask.id = res.getId()

          continue
        }

        // update subtask
        updateSubtaskTemplate.setName(subtask.name)
        updateSubtaskTemplate.setSubtaskId(subtask.id)

        await taskTemplateService.updateTaskTemplateSubTask(updateSubtaskTemplate, getAuthenticatedGrpcMetadata())
      }

      // update task template
      const res = await taskTemplateService.updateTaskTemplate(updateTaskTemplate, getAuthenticatedGrpcMetadata())
      const newTaskTemplate: TaskTemplateDTO = { ...taskTemplate, ...res }

      templateForm.deletedSubtaskIds = []
      setTemplate(newTaskTemplate)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousTaskTemplates = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey])
      queryClient.setQueryData<TaskTemplateDTO[]>(
        [queryKey],
        (old) => old)
      return { previousTaskTemplates }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousTaskTemplates)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
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
        const subTask = new SubTask()
        subTask.setName(cSubtask.name)
        return subTask
      }))

      if (wardId) {
        createTaskTemplate.setWardId(wardId)
      }

      const res = await taskTemplateService.createTaskTemplate(createTaskTemplate, getAuthenticatedGrpcMetadata())
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
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}

export const useDeleteMutation = (queryKey: QueryKey, setTemplate: (task?: TaskTemplateDTO) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskTemplate: TaskTemplateDTO) => {
      const deleteTaskTemplate = new DeleteTaskTemplateRequest()
      deleteTaskTemplate.setId(taskTemplate.id)
      await taskTemplateService.deleteTaskTemplate(deleteTaskTemplate, getAuthenticatedGrpcMetadata())

      setTemplate(undefined)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousTaskTemplate = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey])
      queryClient.setQueryData<TaskTemplateDTO[]>(
        [queryKey],
        (old) => old)
      return { previousTaskTemplate }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousTaskTemplate)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}

export const useSubTaskTemplateDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtaskId: string) => {
      const deleteSubtaskTaskTemplate = new DeleteTaskTemplateSubTaskRequest()
      deleteSubtaskTaskTemplate.setId(subtaskId)
      await taskTemplateService.deleteTaskTemplateSubTask(deleteSubtaskTaskTemplate, getAuthenticatedGrpcMetadata())
      queryClient.refetchQueries(['personalTaskTemplates']).then()
      callback()
      return deleteSubtaskTaskTemplate.toObject()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['personalTaskTemplates'] }).then()
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
      await taskTemplateService.updateTaskTemplateSubTask(updateSubtaskTemplate, getAuthenticatedGrpcMetadata())
      const newSubtask: SubTaskDTO = { ...subtask }
      queryClient.refetchQueries(['wardTaskTemplates']).then()
      callback(newSubtask)
      return updateSubtaskTemplate.toObject()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['personalTaskTemplates'] }).then()
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
      await taskTemplateService.createTaskTemplateSubTask(createSubTaskTemplate, getAuthenticatedGrpcMetadata())

      queryClient.refetchQueries(['wardTaskTemplates']).then()
      return createSubTaskTemplate.toObject()
    },
  })
}
