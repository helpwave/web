import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/components/user_input/Input'
import { getAuthenticatedGrpcMetadata, taskTemplateService } from '../utils/grpc'
import {
  CreateTaskTemplateRequest, CreateTaskTemplateSubTaskRequest,
  DeleteTaskTemplateRequest, DeleteTaskTemplateSubTaskRequest,
  GetAllTaskTemplatesByCreatorRequest,
  GetAllTaskTemplatesByWardRequest, UpdateTaskTemplateRequest, UpdateTaskTemplateSubTaskRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/task_template_svc_pb'
import SubTask = CreateTaskTemplateRequest.SubTask
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'

export type TaskTemplateDTO = {
  wardId? : string,
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

export const useWardTaskTemplateQuery = (wardId? : string, onSuccess: (data: TaskTemplateDTO[]) => void = noop) => {
  return useQuery({
    queryKey: ['wardTaskTemplates', wardId],
    queryFn: async () => {
      let wardTaskTemplates : TaskTemplateDTO[] = []
      if (wardId !== undefined) {
        const req = new GetAllTaskTemplatesByWardRequest()
        req.setWardId(wardId)
        const res = await taskTemplateService.getAllTaskTemplatesByWard(req, getAuthenticatedGrpcMetadata())
        wardTaskTemplates = res.getTemplatesList().map((template) => ({
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
        return wardTaskTemplates
      }

      return wardTaskTemplates
    },
    onSuccess
  })
}

export const usePersonalTaskTemplateQuery = (createdBy? : string, onSuccess: (data: TaskTemplateDTO[]) => void = noop) => {
  return useQuery({
    queryKey: ['personalTaskTemplates', createdBy],
    queryFn: async () => {
      let personalTaskTemplates: TaskTemplateDTO[] = []
      if (createdBy !== undefined) {
        const req = new GetAllTaskTemplatesByCreatorRequest()
        req.setCreatedBy(createdBy)
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
        // return only personal Task Templates
        return personalTaskTemplates
      }
      return personalTaskTemplates
    },
    onSuccess
  })
}

export const useUpdateMutation = (queryKey: QueryKey, setTemplate: (taskTemplate:TaskTemplateDTO | undefined) => void) => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const router = useRouter()
  const { uuid: warId } = router.query
  return useMutation({
    mutationFn: async (taskTemplate: TaskTemplateDTO) => {
      let previousTaskTemplate = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey, user?.id])
      if (queryKey === 'wardTaskTemplates') {
        previousTaskTemplate = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey, warId?.toString()])
      }

      //  update task template
      const updateTaskTemplate = new UpdateTaskTemplateRequest()
      updateTaskTemplate.setName(taskTemplate.name)
      updateTaskTemplate.setDescription(taskTemplate.notes)
      updateTaskTemplate.setId(taskTemplate.id)

      const res = await taskTemplateService.updateTaskTemplate(updateTaskTemplate, getAuthenticatedGrpcMetadata())
      const newTaskTemplate: TaskTemplateDTO = { ...taskTemplate, ...res }

      const updateSubtaskTemplate = new UpdateTaskTemplateSubTaskRequest()
      const createSubTaskTemplate = new CreateTaskTemplateSubTaskRequest()

      let subtasksToDelete = previousTaskTemplate?.map(template => template.subtasks).flat()

      for (const subtask of taskTemplate.subtasks) {
        // add new subtasks to tak template
        if (!subtask.id) {
          createSubTaskTemplate.setName(subtask.name)
          createSubTaskTemplate.setTaskTemplateId(taskTemplate.id)
          await taskTemplateService.createTaskTemplateSubTask(createSubTaskTemplate, getAuthenticatedGrpcMetadata())

          continue
        }
        // update subtasks
        updateSubtaskTemplate.setName(subtask.name)
        updateSubtaskTemplate.setSubtaskId(subtask.id)

        // ignore subtask from deletion
        subtasksToDelete =
          subtasksToDelete?.filter(subtaskToDelete => subtaskToDelete.id !== subtask.id)

        await taskTemplateService.updateTaskTemplateSubTask(updateSubtaskTemplate, getAuthenticatedGrpcMetadata())
      }

      // delete subtask from template
      const deleteSubtaskTaskTemplate = new DeleteTaskTemplateSubTaskRequest()
      if (subtasksToDelete !== undefined) {
        for (const subtask of subtasksToDelete) {
          deleteSubtaskTaskTemplate.setId(subtask.id)
          await taskTemplateService.deleteTaskTemplateSubTask(deleteSubtaskTaskTemplate, getAuthenticatedGrpcMetadata())
        }
      }

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

export const useCreateMutation = (queryKey: QueryKey, setTemplate: (taskTemplate:TaskTemplateDTO | undefined) => void) => {
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

      if (taskTemplate.wardId !== undefined) {
        createTaskTemplate.setWardId(taskTemplate.wardId)
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

export const useDeleteMutation = (queryKey: QueryKey, setTemplate: (task:TaskTemplateDTO | undefined) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskTemplate) => {
      const deleteTaskTemplate = new DeleteTaskTemplateRequest()
      deleteTaskTemplate.setId(taskTemplate.id)
      await taskTemplateService.deleteTaskTemplate(deleteTaskTemplate, getAuthenticatedGrpcMetadata())

      setTemplate(undefined)
    },
    onMutate: async (taskTemplate: TaskTemplateDTO) => {
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
