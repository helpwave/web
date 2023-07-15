import {
  TaskStatus,
  GetTasksByPatientRequest,
  GetTasksByPatientSortedByStatusRequest, TaskToToDoRequest, TaskToInProgressRequest, TaskToDoneRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import type { GetTasksByPatientSortedByStatusResponse } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import { getAuthenticatedGrpcMetadata, taskService } from '../utils/grpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/components/user_input/Input'

export type SubTaskDTO = {
  id: string,
  name: string,
  isDone: boolean
}

export type TaskDTO = {
  id: string,
  name: string,
  assignee: string,
  notes: string,
  status: TaskStatus,
  subtasks: SubTaskDTO[],
  dueDate: Date,
  creationDate?: Date,
  isPublicVisible: boolean
}

export type TaskMinimalDTO = {
  id: string,
  name: string,
  status: TaskStatus
}

export type SortedTasks = {
  [TaskStatus.TASK_STATUS_TODO]: TaskDTO[],
  [TaskStatus.TASK_STATUS_IN_PROGRESS]: TaskDTO[],
  [TaskStatus.TASK_STATUS_DONE]: TaskDTO[]
}

export const emptySortedTasks: SortedTasks = {
  [TaskStatus.TASK_STATUS_TODO]: [],
  [TaskStatus.TASK_STATUS_IN_PROGRESS]: [],
  [TaskStatus.TASK_STATUS_DONE]: []
}

export const tasksQueryKey = 'tasks'

export const useTasksByPatientQuery = (patientID: string | undefined) => {
  return useQuery({
    queryKey: [tasksQueryKey],
    enabled: !!patientID,
    queryFn: async () => {
      if (!patientID) {
        return
      }

      const req = new GetTasksByPatientRequest()
      req.setPatientId(patientID)

      const res = await taskService.getTasksByPatient(req, getAuthenticatedGrpcMetadata())

      if (!res.getTasksList()) {
        // TODO some check whether request was successful
        console.error('TasksByPatient query failed')
      }

      const tasks: TaskDTO[] = res.getTasksList().map(task => ({
        id: task.getId(),
        name: task.getName(),
        status: task.getStatus(),
        notes: task.getDescription(),
        isPublicVisible: task.getPublic(),
        assignee: task.getAssignedUserId(),
        dueDate: new Date(), // TODO replace later
        subtasks: task.getSubtasksList().map(subtask => ({
          id: subtask.getId(),
          name: subtask.getName(),
          isDone: subtask.getDone()
        }))
      }))

      return tasks
    },
  })
}

export const useTasksByPatientSortedByStatusQuery = (patientID: string | undefined) => {
  return useQuery({
    queryKey: [tasksQueryKey],
    enabled: !!patientID,
    queryFn: async () => {
      if (!patientID) {
        return emptySortedTasks
      }

      const req = new GetTasksByPatientSortedByStatusRequest()
      req.setPatientId(patientID)

      const res = await taskService.getTasksByPatientSortedByStatus(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        // TODO some check whether request was successful
        console.error('TasksByPatientSortedByStatus query failed')
      }

      const mapping = (task: GetTasksByPatientSortedByStatusResponse.Task, status: TaskStatus) => ({
        id: task.getId(),
        name: task.getName(),
        status,
        notes: task.getDescription(),
        isPublicVisible: task.getPublic(),
        assignee: task.getAssignedUserId(),
        dueDate: new Date(), // TODO replace later
        subtasks: task.getSubtasksList().map(subtask => ({
          id: subtask.getId(),
          name: subtask.getName(),
          isDone: subtask.getDone()
        }))
      })

      const tasks: SortedTasks = {
        [TaskStatus.TASK_STATUS_TODO]: res.getTodoList().map(value => mapping(value, TaskStatus.TASK_STATUS_TODO)),
        [TaskStatus.TASK_STATUS_IN_PROGRESS]: res.getInProgressList().map(value => mapping(value, TaskStatus.TASK_STATUS_IN_PROGRESS)),
        [TaskStatus.TASK_STATUS_DONE]: res.getDoneList().map(value => mapping(value, TaskStatus.TASK_STATUS_DONE)),
      }

      return tasks
    },
  })
}

export const useTaskToToDoMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskID: string) => {
      const req = new TaskToToDoRequest()
      req.setId(taskID)
      await taskService.taskToToDo(req, getAuthenticatedGrpcMetadata())

      // TODO some check whether request was successful

      queryClient.refetchQueries([tasksQueryKey]).then()
      callback()
      return req.toObject()
    },
  })
}

export const useTaskToInProgressMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskID: string) => {
      const req = new TaskToInProgressRequest()
      req.setId(taskID)
      await taskService.taskToInProgress(req, getAuthenticatedGrpcMetadata())

      // TODO some check whether request was successful

      queryClient.refetchQueries([tasksQueryKey]).then()
      callback()
      return req.toObject()
    },
  })
}

export const useTaskToDoneMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskID: string) => {
      const req = new TaskToDoneRequest()
      req.setId(taskID)
      await taskService.taskToDone(req, getAuthenticatedGrpcMetadata())

      // TODO some check whether request was successful

      queryClient.refetchQueries([tasksQueryKey]).then()
      callback()
      return req.toObject()
    },
  })
}
