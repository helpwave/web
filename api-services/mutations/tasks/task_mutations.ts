import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/hightide'
import {
  AssignTaskRequest,
  CreateSubtaskRequest,
  CreateTaskRequest,
  DeleteSubtaskRequest, DeleteTaskRequest,
  GetTaskRequest,
  GetTasksByPatientRequest,
  UnassignTaskRequest,
  UpdateSubtaskRequest,
  UpdateTaskRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/task_svc_pb'
import type { CreateSubTaskDTO, SubTaskDTO, TaskDTO } from '../../types/tasks/task'
import { emptyTask } from '../../types/tasks/task'
import { QueryKeys } from '../query_keys'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import { GRPCConverter } from '../../util/util'
import { roomOverviewsQueryKey } from './room_mutations'
import { GRPCMapper } from './util'

type TaskAssignmentRequestProps = {
  taskId: string,
  userId: string,
}

export const useTaskQuery = (taskId: string | undefined) => {
  return useQuery({
    queryKey: [QueryKeys.tasks, taskId, 'get'],
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
        assignee: res.getAssignedUserId(),
        subtasks: res.getSubtasksList().map(GRPCMapper.subtaskFromGRPC),
        createdAt: res.getCreatedAt() ? GRPCConverter.timestampToDate(res.getCreatedAt()!) : new Date(),
        dueDate: res.getDueAt() ? GRPCConverter.timestampToDate(res.getCreatedAt()!) : new Date(),
        isPublicVisible: true, // TODO set when backend provides it
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

      const res = await APIServices.task.getTasksByPatient(req, getAuthenticatedGrpcMetadata())

      const tasks: TaskDTO[] = res.getTasksList().map(task => {
        const dueAt = task.getDueAt()
        return {
          id: task.getId(),
          name: task.getName(),
          status: GRPCConverter.taskStatusFromGRPC(task.getStatus()),
          notes: task.getDescription(),
          isPublicVisible: task.getPublic(),
          assignee: task.getAssignedUserId(),
          dueDate: dueAt ? GRPCConverter.timestampToDate(dueAt) : undefined,
          subtasks: task.getSubtasksList().map(GRPCMapper.subtaskFromGRPC),
          creationDate: task.getCreatedAt() ? GRPCConverter.timestampToDate(task.getCreatedAt()!) : undefined,
          creatorId: task.getCreatedBy(),
        }
      })

      return tasks
    }
  })
}

// TODO move patientId to task object
export const useTaskCreateMutation = (callback: (task: TaskDTO) => void = noop, patientId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: TaskDTO) => {
      const req = new CreateTaskRequest()
        .setName(task.name)
        .setPatientId(patientId)
        .setDescription(task.notes)
        .setPublic(task.isPublicVisible)
        .setInitialStatus(GRPCConverter.taskStatusToGrpc(task.status))
        .setDueAt(task.dueDate ? GRPCConverter.dateToTimestamp(task.dueDate) : undefined)
        .setSubtasksList(task.subtasks.map(subtask => (new CreateTaskRequest.SubTask())
          .setName(subtask.name)
          .setDone(subtask.isDone)))

      if(task.assignee) {
        req.setAssignedUserId(task.assignee)
      }

      const res = await APIServices.task.createTask(req, getAuthenticatedGrpcMetadata())
      const newTask: TaskDTO = {
        ...task,
        id: res.getId()
      }

      callback(newTask)
      return newTask
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks, QueryKeys.patients]).catch(console.error)
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
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
      updateTask.setStatus(GRPCConverter.taskStatusToGrpc(task.status))

      await APIServices.task.updateTask(updateTask, getAuthenticatedGrpcMetadata())

      callback()
      return !!updateTask.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).catch(console.error)
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
    }
  })
}

export const useTaskDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const req = new DeleteTaskRequest()
      req.setId(taskId)
      await APIServices.task.deleteTask(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).catch(console.error)
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
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
      const req = new CreateSubtaskRequest()
      req.setSubtask(new CreateSubtaskRequest.Subtask().setName(subtask.name))
      req.setTaskId(usedTaskId)
      const res = await APIServices.task.createSubtask(req, getAuthenticatedGrpcMetadata())

      const newSubtask: SubTaskDTO = {
        id: res.getSubtaskId(),
        name: subtask.name,
        isDone: false,
      }

      callback(newSubtask)
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).catch(console.error)
    }
  })
}

// TODO move taskId parameter to subtask object
export const useSubTaskUpdateMutation = (taskId?: string, callback: (subtask: SubTaskDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtask: SubTaskDTO) => {
      if (!taskId) {
        throw Error('SubTaskUpdateMutation: A taskId must be provided')
      }
      const req = new UpdateSubtaskRequest()
      req.setSubtaskId(subtask.id)
        .setTaskId(taskId)
        .setSubtask(new UpdateSubtaskRequest.Subtask()
          .setName(subtask.name)
          .setDone(subtask.isDone))
      await APIServices.task.updateSubtask(req, getAuthenticatedGrpcMetadata())

      const newSubtask: SubTaskDTO = { ...subtask }

      callback(newSubtask)
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).catch(console.error)
    }
  })
}

export const useSubTaskDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtaskId: string) => {
      const req = new DeleteSubtaskRequest()
      // req.setTaskId()
      req.setSubtaskId(subtaskId)
      await APIServices.task.deleteSubtask(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.tasks]).catch(console.error)
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
      queryClient.refetchQueries([QueryKeys.tasks]).catch(console.error)
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
      queryClient.refetchQueries([QueryKeys.tasks]).catch(console.error)
    }
  })
}
