import {
  GetTasksByPatientRequest,
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
  SubTaskToToDoRequest,
  GetTasksByPatientSortedByStatusRequest,
  AssignTaskToUserRequest,
  UnassignTaskFromUserRequest,
  type GetTasksByPatientSortedByStatusResponse
} from '@helpwave/proto-ts/services/task_svc/v1/task_svc_pb'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/util/noop'
import { roomOverviewsQueryKey, roomsQueryKey } from './room_mutations'
import { getAuthenticatedGrpcMetadata, taskService } from '@/utils/grpc'
import type { CreateSubTaskDTO, SortedTasks, SubTaskDTO, TaskDTO, TaskStatus } from '@/mutations/types/task'
import { emptySortedTasks, emptyTask } from '@/mutations/types/task'
import { GRPCConverter } from '@/mutations/util'

export const tasksQueryKey = 'tasks'

export const useTaskQuery = (taskId: string | undefined) => {
  return useQuery({
    queryKey: [tasksQueryKey],
    enabled: !!taskId,
    queryFn: async () => {
      if (!taskId) {
        return emptyTask
      }

      const req = new GetTaskRequest()
      req.setId(taskId)

      const res = await taskService.getTask(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('TasksByPatient query failed')
      }

      const dueAt = res.getDueAt()
      const task: TaskDTO = {
        id: res.getId(),
        name: res.getName(),
        status: GRPCConverter.taskStatusFromGRPC(res.getStatus()),
        notes: res.getDescription(),
        isPublicVisible: res.getPublic(),
        assignee: res.getAssignedUserId(),
        dueDate: dueAt ? GRPCConverter.timestampToDate(dueAt) : undefined,
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
export const useTasksByPatientQuery = (patientId: string | undefined) => {
  return useQuery({
    queryKey: [tasksQueryKey, tasksByPatientQueryKey],
    enabled: !!patientId,
    queryFn: async () => {
      if (!patientId) {
        return
      }

      const req = new GetTasksByPatientRequest()
      req.setPatientId(patientId)

      const res = await taskService.getTasksByPatient(req, getAuthenticatedGrpcMetadata())

      if (!res.getTasksList()) {
        console.error('TasksByPatient query failed')
      }

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
          subtasks: task.getSubtasksList().map(subtask => ({
            id: subtask.getId(),
            name: subtask.getName(),
            isDone: subtask.getDone()
          }))
        }
      })

      return tasks
    }
  })
}

export const sortedTasksByPatientQueryKey = 'sortedTasksByPatient'
export const useTasksByPatientSortedByStatusQuery = (patientId: string | undefined) => {
  return useQuery({
    queryKey: [tasksQueryKey, sortedTasksByPatientQueryKey],
    enabled: !!patientId,
    queryFn: async () => {
      if (!patientId) {
        return emptySortedTasks
      }

      const req = new GetTasksByPatientSortedByStatusRequest()
      req.setPatientId(patientId)

      const res = await taskService.getTasksByPatientSortedByStatus(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('TasksByPatientSortedByStatus query failed')
      }

      const mapping = (task: GetTasksByPatientSortedByStatusResponse.Task, status: TaskStatus) => {
        const dueAt = task.getDueAt()
        return {
          id: task.getId(),
          name: task.getName(),
          status,
          notes: task.getDescription(),
          isPublicVisible: task.getPublic(),
          assignee: task.getAssignedUserId(),
          dueDate: dueAt ? GRPCConverter.timestampToDate(dueAt) : undefined,
          subtasks: task.getSubtasksList().map(subtask => ({
            id: subtask.getId(),
            name: subtask.getName(),
            isDone: subtask.getDone()
          }))
        }
      }

      const tasks: SortedTasks = {
        todo: res.getTodoList().map(value => mapping(value, 'todo')),
        inProgress: res.getInProgressList().map(value => mapping(value, 'inProgress')),
        done: res.getDoneList().map(value => mapping(value, 'done')),
      }

      return tasks
    },
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

      const res = await taskService.createTask(req, getAuthenticatedGrpcMetadata())
      const newTask = { ...task, id: res.getId() }

      callback(newTask)
      return newTask
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
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
      updateTask.setPublic(task.isPublicVisible)

      const getTask = new GetTaskRequest()
      const removeSubtask = new RemoveSubTaskRequest()

      getTask.setId(task.id)

      const taskResponse = await taskService.getTask(getTask, getAuthenticatedGrpcMetadata())
      const subtasksResponse = taskResponse.getSubtasksList()
      const taskSubtasks = task.subtasks

      // remove subtasks
      const subtasksToDelete = subtasksResponse.filter(subtask => !taskSubtasks.some(taskSubtask => taskSubtask.id === subtask.getId()))
      for (const subtask of subtasksToDelete) {
        removeSubtask.setId(subtask.getId())
        await taskService.removeSubTask(removeSubtask, getAuthenticatedGrpcMetadata())
      }

      const updateSubtask = new UpdateSubTaskRequest()
      const createSubTask = new AddSubTaskRequest()

      const subTaskToDone = new SubTaskToDoneRequest()
      const subTaskToDo = new SubTaskToToDoRequest()

      for (const subtask of task.subtasks) {
        // create new subtasks
        if (!subtask.id) {
          createSubTask.setName(subtask.name)
          createSubTask.setTaskId(task.id)
          createSubTask.setDone(subtask.isDone)

          const res = await taskService.addSubTask(createSubTask, getAuthenticatedGrpcMetadata())
          subtask.id = res.getId()

          continue
        }

        if (subtask.isDone) {
          subTaskToDone.setId(subtask.id)
          await taskService.subTaskToDone(subTaskToDone, getAuthenticatedGrpcMetadata())
        } else {
          subTaskToDo.setId(subtask.id)
          await taskService.subTaskToToDo(subTaskToDo, getAuthenticatedGrpcMetadata())
        }

        updateSubtask.setName(subtask.name)
        updateSubtask.setId(subtask.id)

        await taskService.updateSubTask(updateSubtask, getAuthenticatedGrpcMetadata())
      }

      await taskService.updateTask(updateTask, getAuthenticatedGrpcMetadata())

      callback()
      return updateTask.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
    }
  })
}

export const useTaskDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const req = new DeleteTaskRequest()
      req.setId(taskId)
      await taskService.deleteTask(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey, sortedTasksByPatientQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
    }
  })
}

export const useTaskToToDoMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const req = new TaskToToDoRequest()
      req.setId(taskId)
      await taskService.taskToToDo(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
    }
  })
}

export const useTaskToInProgressMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const req = new TaskToInProgressRequest()
      req.setId(taskId)
      await taskService.taskToInProgress(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
    }
  })
}

export const useTaskToDoneMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const req = new TaskToDoneRequest()
      req.setId(taskId)
      await taskService.taskToDone(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
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
      const res = await taskService.addSubTask(req, getAuthenticatedGrpcMetadata())

      const newSubtask: SubTaskDTO = {
        id: res.getId(),
        name: subtask.name,
        isDone: subtask.isDone,
      }

      callback(newSubtask)
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
    }
  })
}

export const useSubTaskUpdateMutation = (callback: (subtask: SubTaskDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtask: SubTaskDTO) => {
      const req = new UpdateSubTaskRequest()
      req.setId(subtask.id)
      req.setName(subtask.name)
      await taskService.updateSubTask(req, getAuthenticatedGrpcMetadata())
      const newSubtask: SubTaskDTO = { ...subtask }

      callback(newSubtask)
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
    }
  })
}

export const useSubTaskDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtaskId: string) => {
      const req = new RemoveSubTaskRequest()
      req.setId(subtaskId)
      await taskService.removeSubTask(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
    }
  })
}

export const useSubTaskToToDoMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtaskId: string) => {
      const req = new SubTaskToToDoRequest()
      req.setId(subtaskId)
      await taskService.subTaskToToDo(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
    }
  })
}

export const useSubTaskToDoneMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtaskId: string) => {
      const req = new SubTaskToDoneRequest()
      req.setId(subtaskId)
      await taskService.subTaskToDone(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
    }
  })
}

export const useAssignTaskToUserMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskAndUser: {taskId: string, userId: string}) => {
      const req = new AssignTaskToUserRequest()
      req.setId(taskAndUser.taskId)
      req.setUserId(taskAndUser.userId)
      const res = await taskService.assignTaskToUser(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in AssignTaskToUser')
      }

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
    }
  })
}

export const useUnassignTaskToUserMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const req = new UnassignTaskFromUserRequest()
      req.setId(taskId)
      const res = await taskService.unassignTaskFromUser(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in UnAssignTaskToUser')
      }

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
    }
  })
}
