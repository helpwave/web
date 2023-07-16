import {
  TaskStatus,
  GetTasksByPatientRequest,
  GetTasksByPatientSortedByStatusRequest,
  TaskToToDoRequest,
  TaskToInProgressRequest,
  TaskToDoneRequest,
  DeleteTaskRequest,
  CreateTaskRequest,
  AddSubTaskRequest,
  UpdateSubTaskRequest,
  RemoveSubTaskRequest,
  GetTaskRequest,
  UpdateTaskRequest,
  SubTaskToDoneRequest,
  SubTaskToToDoRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import type { GetTasksByPatientSortedByStatusResponse } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import { getAuthenticatedGrpcMetadata, taskService } from '../utils/grpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/components/user_input/Input'
import { roomOverviewsQueryKey, roomsQueryKey } from './room_mutations'

export type SubTaskDTO = {
  id: string,
  name: string,
  isDone: boolean
}

export type CreateSubTaskDTO = SubTaskDTO & {
  taskID?: string
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

export const emptyTask: TaskDTO = {
  id: '',
  name: '',
  assignee: '',
  notes: '',
  status: TaskStatus.TASK_STATUS_TODO,
  subtasks: [],
  dueDate: new Date(),
  isPublicVisible: false
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

export const useTaskQuery = (taskID: string | undefined) => {
  return useQuery({
    queryKey: [tasksQueryKey],
    enabled: !!taskID,
    queryFn: async () => {
      if (!taskID) {
        return emptyTask
      }

      const req = new GetTaskRequest()
      req.setId(taskID)

      const res = await taskService.getTask(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('TasksByPatient query failed')
      }

      const task: TaskDTO = {
        id: res.getId(),
        name: res.getName(),
        status: res.getStatus(),
        notes: res.getDescription(),
        isPublicVisible: res.getPublic(),
        assignee: res.getAssignedUserId(),
        dueDate: new Date(), // TODO replace later
        subtasks: res.getSubtasksList().map(subtask => ({
          id: subtask.getId(),
          name: subtask.getName(),
          isDone: subtask.getDone()
        }))
      }

      return task
    },
  })
}

export const tasksByPatientQueryKey = 'tasksByPatient'
export const useTasksByPatientQuery = (patientID: string | undefined) => {
  return useQuery({
    queryKey: [tasksQueryKey, tasksByPatientQueryKey],
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

export const sortedTasksByPatientQueryKey = 'sortedTasksByPatient'
export const useTasksByPatientSortedByStatusQuery = (patientID: string | undefined) => {
  return useQuery({
    queryKey: [tasksQueryKey, sortedTasksByPatientQueryKey],
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

export const useTaskCreateMutation = (callback: (task: TaskDTO) => void = noop, patientID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: TaskDTO) => {
      const req = new CreateTaskRequest()
      req.setName(task.name)
      req.setPatientId(patientID)
      req.setDescription(task.notes)
      req.setPublic(task.isPublicVisible)
      const res = await taskService.createTask(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error with TaskCreate')
      }

      const newTask = { ...task, id: res.getId() }
      queryClient.refetchQueries([tasksQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      callback(newTask)
      return newTask
    },
  })
}

export const useTaskUpdateMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: TaskDTO) => {
      const req = new UpdateTaskRequest()
      req.setId(task.id)
      req.setDescription(task.notes)
      req.setName(task.name)
      const res = await taskService.updateTask(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in TaskUpdate')
      }

      queryClient.refetchQueries([tasksQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      callback()
      return req.toObject()
    },
  })
}

export const useTaskDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskID: string) => {
      const req = new DeleteTaskRequest()
      req.setId(taskID)
      const res = await taskService.deleteTask(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in TaskDelete')
      }

      queryClient.refetchQueries([tasksQueryKey, sortedTasksByPatientQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      callback()
      return req.toObject()
    },
  })
}

export const useTaskToToDoMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskID: string) => {
      const req = new TaskToToDoRequest()
      req.setId(taskID)
      const res = await taskService.taskToToDo(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in TaskToToDo')
      }

      queryClient.refetchQueries([tasksQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
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
      const res = await taskService.taskToInProgress(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in TaskToInProgress')
      }

      queryClient.refetchQueries([tasksQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
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
      const res = await taskService.taskToDone(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in TaskToDone')
      }

      queryClient.refetchQueries([tasksQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      callback()
      return req.toObject()
    },
  })
}

export const useSubTaskAddMutation = (callback: (subtask: SubTaskDTO) => void = noop, taskID: string | undefined) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtask: CreateSubTaskDTO) => {
      const usedTaskID = subtask.taskID ?? taskID ?? ''
      if (!usedTaskID) {
        return
      }
      const req = new AddSubTaskRequest()
      req.setName(subtask.name)
      req.setTaskId(usedTaskID)
      req.setDone(subtask.isDone)
      const res = await taskService.addSubTask(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in SubTaskCreate')
      }

      const newSubtask: SubTaskDTO = {
        id: res.getId(),
        name: subtask.name,
        isDone: subtask.isDone,
      }
      queryClient.refetchQueries([tasksQueryKey]).then()
      callback(newSubtask)
      return req.toObject()
    },
  })
}

export const useSubTaskUpdateMutation = (callback: (subtask: SubTaskDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtask: SubTaskDTO) => {
      const req = new UpdateSubTaskRequest()
      req.setId(subtask.id)
      req.setName(subtask.name)
      const res = await taskService.updateSubTask(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in SubTaskUpdate')
      }

      const newSubtask: SubTaskDTO = { ...subtask }
      queryClient.refetchQueries([tasksQueryKey]).then()
      callback(newSubtask)
      return req.toObject()
    },
  })
}

export const useSubTaskDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtaskID: string) => {
      const req = new RemoveSubTaskRequest()
      req.setId(subtaskID)
      const res = await taskService.removeSubTask(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in SubTaskDelete')
      }

      queryClient.refetchQueries([tasksQueryKey]).then()
      callback()
      return req.toObject()
    },
  })
}

export const useSubTaskToToDoMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtaskID: string) => {
      const req = new SubTaskToToDoRequest()
      req.setId(subtaskID)
      const res = await taskService.subTaskToToDo(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in SubTaskToToDo')
      }

      queryClient.refetchQueries([tasksQueryKey]).then()
      callback()
      return req.toObject()
    },
  })
}

export const useSubTaskToDoneMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtaskID: string) => {
      const req = new SubTaskToDoneRequest()
      req.setId(subtaskID)
      const res = await taskService.subTaskToDone(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in SubTaskToDone')
      }

      queryClient.refetchQueries([tasksQueryKey]).then()
      callback()
      return req.toObject()
    },
  })
}
