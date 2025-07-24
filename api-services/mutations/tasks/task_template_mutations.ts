import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { TaskTemplateDTO } from '../../types/tasks/tasks_templates'
import type { SubtaskDTO } from '../../types/tasks/task'
import type {
  TaskTemplateGetOptions } from '../../service/tasks/TaskTemplateService'
import {
  TaskTemplateService,
  TaskTemplateSubtaskService
} from '../../service/tasks/TaskTemplateService'
import { QueryKeys } from '../query_keys'

const TaskTemplateTypeQueryKey = {
  personal: 0,
  ward: 1
} as const

export const useTaskTemplateQuery = (options?: TaskTemplateGetOptions) => {
  return useQuery({
    queryKey: [QueryKeys.taskTemplates],
    queryFn: async () => {
      return await TaskTemplateService.getMany(options)
    },
  })
}

export const useWardTaskTemplateQuery = (wardId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.taskTemplates, TaskTemplateTypeQueryKey.ward, wardId],
    enabled: !!wardId,
    queryFn: async () => {
      return await TaskTemplateService.getByWard(wardId!)
    },
  })
}

export const useAllTaskTemplatesByCreator = (
  createdBy: string,
  onlyPersonal: boolean = false
) => {
  return useQuery({
    queryKey: [QueryKeys.taskTemplates, onlyPersonal ? TaskTemplateTypeQueryKey.personal : TaskTemplateTypeQueryKey.ward, createdBy],
    queryFn: async () => {
      return await TaskTemplateService.getByCreator(createdBy)
    },
  })
}

export const usePersonalTaskTemplateQuery = (createdBy?: string) => {
  return useQuery({
    queryKey: [QueryKeys.taskTemplates, TaskTemplateTypeQueryKey.personal, createdBy],
    enabled: !!createdBy,
    queryFn: async () => {
      return await TaskTemplateService.getByCreator(createdBy!, false)
    },
  })
}

export const useTaskTemplateCreateMutation = (options?: UseMutationOptions<TaskTemplateDTO, unknown, TaskTemplateDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (taskTemplate: TaskTemplateDTO) => {
      return await TaskTemplateService.create(taskTemplate)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      const key = data.wardId ? TaskTemplateTypeQueryKey.ward : TaskTemplateTypeQueryKey.personal
      queryClient.invalidateQueries({ queryKey: [QueryKeys.taskTemplates, key] }).catch(console.error)
    },
  })
}

export const useTaskTemplateUpdateMutation = (options?: UseMutationOptions<boolean, unknown, TaskTemplateDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (template: TaskTemplateDTO) => {
      return await TaskTemplateService.update(template)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      const key = variables.wardId ? TaskTemplateTypeQueryKey.ward : TaskTemplateTypeQueryKey.personal
      queryClient.invalidateQueries({ queryKey: [QueryKeys.taskTemplates, key] }).catch(console.error)
    },
  })
}

export const useTaskTemplateDeleteMutation = (options?: UseMutationOptions<boolean, unknown, string>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (taskTemplateId: string) => {
      return await TaskTemplateService.delete(taskTemplateId)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries({ queryKey: [QueryKeys.taskTemplates] }).catch(console.error)
    },
  })
}

export const useTaskTemplateSubtaskCreateMutation = (options?: UseMutationOptions<SubtaskDTO, unknown, SubtaskDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (subtask: SubtaskDTO) => {
      return await TaskTemplateSubtaskService.create(subtask)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries({ queryKey: [QueryKeys.taskTemplates] }).catch(console.error)
    },
  })
}

export const useTaskTemplateSubtaskUpdateMutation = (options?: UseMutationOptions<boolean, unknown, SubtaskDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (subtask: SubtaskDTO) => {
      return await TaskTemplateSubtaskService.update(subtask)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries({ queryKey: [QueryKeys.taskTemplates] }).catch(console.error)
    },
  })
}

export const useTaskTemplateSubtaskDeleteMutation = (options?: UseMutationOptions<boolean, unknown, string>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (subtaskId: string) => {
      return await TaskTemplateSubtaskService.delete(subtaskId)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries({ queryKey: [QueryKeys.taskTemplates] }).catch(console.error)
    },
  })
}
