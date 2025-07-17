import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SubTaskDTO, TaskDTO } from '../../types/tasks/task'
import { QueryKeys } from '../query_keys'
import { roomOverviewsQueryKey } from './room_mutations'
import type { TaskAssignmentRequestProps } from '../../service/tasks/TaskService'
import { TaskService } from '../../service/tasks/TaskService'
import { TaskSubtaskService } from '../../service/tasks/TaskSubtaskService'

export const useTaskQuery = (taskId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.tasks, taskId, 'get'],
    enabled: !!taskId,
    queryFn: async () => {
      return await TaskService.get(taskId!)
    },
  })
}

export const useTasksByPatientQuery = (patientId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.tasks, QueryKeys.patients, patientId],
    enabled: !!patientId,
    queryFn: async () => {
      return await TaskService.getByPatientId(patientId!)
    }
  })
}

export const useMyTasksQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.tasks, 'my'],
    queryFn: async () => {
      return await TaskService.getMyTasks()
    }
  })
}

export const useTaskCreateMutation = (options?: UseMutationOptions<TaskDTO, unknown, TaskDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (task: TaskDTO) => {
      return await TaskService.create(task)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.tasks, QueryKeys.patients]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
    }
  })
}

export const useTaskUpdateMutation = (options?: UseMutationOptions<boolean, unknown, TaskDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (task: TaskDTO) => {
      return await TaskService.update(task)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.tasks]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
    }
  })
}

export const useTaskDeleteMutation = (options?: UseMutationOptions<boolean, unknown, string>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (taskId: string) => {
      return await TaskService.delete(taskId)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.tasks]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
    }
  })
}

export const useSubTaskAddMutation = (options?: UseMutationOptions<SubTaskDTO, unknown, SubTaskDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (subtask: SubTaskDTO) => {
      return await TaskSubtaskService.create(subtask)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.tasks]).catch(console.error)
    }
  })
}

export const useSubTaskUpdateMutation = (options?: UseMutationOptions<boolean, unknown, SubTaskDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (subtask: SubTaskDTO) => {
      return await TaskSubtaskService.update(subtask)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.tasks]).catch(console.error)
    }
  })
}

export const useSubTaskDeleteMutation = (options?: UseMutationOptions<boolean, unknown, string>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (subtaskId: string) => {
      return await TaskSubtaskService.delete(subtaskId)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.tasks]).catch(console.error)
    }
  })
}

export const useAssignTaskMutation = (options?: UseMutationOptions<boolean, unknown, TaskAssignmentRequestProps>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (props: TaskAssignmentRequestProps) => {
      return await TaskService.assign(props)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.tasks]).catch(console.error)
    }
  })
}

export const useUnassignTaskMutation = (options?: UseMutationOptions<boolean, unknown, TaskAssignmentRequestProps>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (props: TaskAssignmentRequestProps) => {
      return await TaskService.unassign(props)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.tasks]).catch(console.error)
    }
  })
}
