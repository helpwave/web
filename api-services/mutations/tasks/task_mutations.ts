import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/util/noop'
import type {
  CreateSubTaskDTO,
  SubTaskDTO,
  TaskDTO,
} from '../../types/tasks/task'
import {
  emptyTask
} from '../../types/tasks/task'
import { QueryKeys } from '../query_keys'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import { GRPCConverter } from '../../util/util'
import { roomOverviewsQueryKey } from './room_mutations'
import {
  AssignTaskRequest,
  UnassignTaskRequest,
  CreateTaskRequest,
  GetTaskRequest,
  UpdateTaskRequest, UpdateSubtaskRequest, DeleteSubtaskRequest,
} from '@helpwave/proto-ts/services/tasks_svc/v1/task_svc_pb'
import { GRPCMapper } from './util'

type TaskAssignmentRequestProps = {
  taskId: string,
  userId: string
}

export const useTaskQuery = (taskId: string | undefined) => {
  return useQuery({
    queryKey: [QueryKeys.tasks, taskId],
    enabled: !!taskId,
    queryFn: async () => {
      if (!taskId) {
        return emptyTask
      }

      const req = new GetTaskRequest()
      req.setId(taskId)

      const res = await APIServices.task.getTask(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('TasksByPatient query failed')
      }

      const task: TaskDTO = {
        id: res.getId(),
        name: res.getName(),
        notes: res.getDescription(),
        status: GRPCConverter.taskStatusFromGRPC(res.getStatus()),
        assignee: res.getAssignedUsersList(),
        subtasks: res.getSubtasksList().map(GRPCMapper.subtaskFromGRPC),
        // use res.getCreatedAt()
      }

      return task
    },
  })
}

export const useTasksByPatientQuery = (patientId: string | undefined) => {
  return useQuery({
    queryKey: [QueryKeys.tasks, QueryKeys.patients, patientId],
    enabled: !!patientId,
    queryFn: async () => {
      if (!patientId) {
        return
      }

      const req = new GetTasksByPatientRequest()
      req.setPatientId(patientId)

      const res = await APIServices.task.getTask(req, getAuthenticatedGrpcMetadata())

      const tasks: TaskDTO[] = res.get().map(task => {
        const dueAt = task.getDueAt()
        return {
          id: task.getId(),
          name: task.getName(),
          status: GRPCConverter.taskStatusFromGRPC(task.getStatus()),
          notes: task.getDescription(),
          isPublicVisible: task.getPublic(),
          assignee: task.getAssignedUserId(),
          dueDate: dueAt ? GRPCConverter.timestampToDate(dueAt) : undefined,
          subtasks: task.getSubtasksList().map(GRPCMapper.subtaskFromGRPC)
        }
      })

      return tasks
    }
  })
}

export const useTaskCreateMutation = (callback: (task: TaskDTO) => void = noop, patientId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: TaskDTO) => {
      const req = new CreateTaskRequest()
      req.setName(task.name)
      req.setPatientId(patientId)
      req.setDescription(task.notes)
      req.setPublic(task.isPublicVisible)
      req.setInitialStatus(GRPCConverter.taskStatusToGrpc(task.status))
      req.setDueAt(task.dueDate ? GRPCConverter.dateToTimestamp(task.dueDate) : undefined)

      const res = await APIServices.task.createTask(req, getAuthenticatedGrpcMetadata())
      const newTask: TaskDTO = {
        ...task,
        id: res.getId()
      }

      callback(newTask)
      return newTask
    },
    onSuccess: (data) => {
      queryClient.refetchQueries([QueryKeys.tasks, QueryKeys.patients, data.]).then()
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).then()
    }
  })
}

export const useTaskUpdateMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: TaskDTO) => {
      const updateTask = new UpdateTaskRequest()

      updateTask.setId(task.id)
      updateTask.setDescription(task.notes)
      updateTask.setName(task.name)
      updateTask.setDueAt(task.dueDate ? GRPCConverter.dateToTimestamp(task.dueDate) : undefined)

      await APIServices.task.updateTask(updateTask, getAuthenticatedGrpcMetadata())

      callback()
      return updateTask.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).then()
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).then()
    }
  })
}

export const useTaskDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const req = new DeleteTaskRequest()
      req.setId(taskId)
      await APIServices.task.(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).then()
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).then()
    }
  })
}

// TODO: taskId: string | undefined => taskId: string -> A taskId is always required to create a SubTask
export const useSubTaskAddMutation = (taskId: string | undefined, callback: (subtask: SubTaskDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtask: CreateSubTaskDTO) => {
      const usedTaskId = subtask.taskId ?? taskId ?? ''
      if (!usedTaskId) {
        return
      }
      const req = new AddSubTaskRequest()
      req.setName(subtask.name)
      req.setTaskId(usedTaskId)
      req.setDone(subtask.isDone)
      const res = await APIServices.task.addSubTask(req, getAuthenticatedGrpcMetadata())

      const newSubtask: SubTaskDTO = {
        id: res.getId(),
        name: subtask.name,
        isDone: subtask.isDone,
      }

      callback(newSubtask)
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).then()
    }
  })
}

export const useSubTaskUpdateMutation = (callback: (subtask: SubTaskDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtask: SubTaskDTO) => {
      const req = new UpdateSubtaskRequest()
      req.setSubtaskId(subtask.id)
      req.setTaskId()
      req.setSubtask(new UpdateSubtaskRequest.Subtask()
        .setName(subtask.name)
        //.setDone(subtask.done)
      )
      await APIServices.task.updateSubtask(req, getAuthenticatedGrpcMetadata())
      const newSubtask: SubTaskDTO = { ...subtask }

      callback(newSubtask)
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).then()
    }
  })
}

export const useSubTaskDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtaskId: string) => {
      const req = new DeleteSubtaskRequest()
      //req.setTaskId()
      req.setSubtaskId(subtaskId)
      await APIServices.task.deleteSubtask(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).then()
    }
  })
}

export const useAssignTaskMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      taskId,
      userId
    }: TaskAssignmentRequestProps) => {
      const req = new AssignTaskRequest()
      req.setTaskId(taskId)
      req.setUserId(userId)
      const res = await APIServices.task.assignTask(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in AssignTaskToUser')
      }

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).then()
    }
  })
}

export const useUnassignTaskMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      taskId,
      userId
    }: TaskAssignmentRequestProps) => {
      const req = new UnassignTaskRequest()
      req.setTaskId(taskId)
      req.setUserId(userId)
      const res = await APIServices.task.unassignTask(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in UnAssignTaskToUser')
      }

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).then()
    }
  })
}
