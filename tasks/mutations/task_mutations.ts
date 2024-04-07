import {
  TaskStatus
} from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/util/noop'
import { roomOverviewsQueryKey, roomsQueryKey } from './room_mutations'

export type TaskMinimal = {
  id: string,
  parentId?: string,
  name: string,
  status: TaskStatus
}

export type Task = TaskMinimal & {
  notes: string,
  assignee: string,
  subtasks: Task[],
  dueDate?: Date,
  creationDate?: Date,
  isPublicVisible: boolean
}

export const emptyTask: Task = {
  id: '',
  name: '',
  assignee: '',
  notes: '',
  status: TaskStatus.TASK_STATUS_TODO,
  subtasks: [],
  dueDate: undefined,
  isPublicVisible: false
}

export type SortedTasks = {
  [TaskStatus.TASK_STATUS_TODO]: Task[],
  [TaskStatus.TASK_STATUS_IN_PROGRESS]: Task[],
  [TaskStatus.TASK_STATUS_DONE]: Task[]
}

export const emptySortedTasks: SortedTasks = {
  [TaskStatus.TASK_STATUS_TODO]: [],
  [TaskStatus.TASK_STATUS_IN_PROGRESS]: [],
  [TaskStatus.TASK_STATUS_DONE]: []
}

// TODO delete later
export let localTasks: Task[] = []

const findTask = (taskId: string): Task | undefined => {
  const recursiveFindTask = (taskId: string, array: Task[]): Task | undefined => {
    for (const task of array) {
      if (task.id === taskId) {
        return task
      }
      const childSearchResult = recursiveFindTask(taskId, task.subtasks)
      if (childSearchResult) {
        return childSearchResult
      }
    }
  }

  const result = recursiveFindTask(taskId, localTasks)
  if (result) {
    return result
  }

  console.error(`Did not find Task with id: ${taskId}`)
  return undefined
}

const addTask = (task: Task) => {
  task.id = Math.random().toString()
  const subtasks = task.subtasks
  task.subtasks = []
  if (task.parentId === undefined) {
    localTasks.push(task)
  } else {
    const parent = findTask(task.parentId)
    if (!parent) {
      console.error(`Parent Task not found: ${task.parentId}`)
      return undefined
    }
    parent.subtasks.push(task)
  }
  for (const subtask of subtasks) {
    subtask.parentId = task.id
    addTask(subtask)
  }
  return task
}

const updateTask = (task: Task) => {
  const localTask = findTask(task.id)
  if (!localTask) {
    return undefined
  }
  const newLocalTask: Task = {
    ...task,
    subtasks: localTask.subtasks,
    parentId: localTask.parentId
  }
  if (task.parentId !== localTask.parentId) {
    console.error('Parent was changed')
  }
  if (localTask.parentId === undefined) {
    localTasks = localTasks.map(task => task.id === newLocalTask.id ? newLocalTask : task)
    return newLocalTask
  }

  const parent = findTask(localTask.parentId)
  if (!parent) {
    console.error(`Parent Task not found: ${task.parentId}`)
    return
  }
  parent.subtasks = parent.subtasks.map(task => task.id === newLocalTask.id ? newLocalTask : task)
  return newLocalTask
}

const deleteTask = (taskId: string) => {
  const task = findTask(taskId)
  if (!task) {
    return
  }
  if (task.parentId === undefined) {
    localTasks = localTasks.filter(task => task.id !== taskId)
    return
  }
  const parent = findTask(task.parentId)
  if (!parent) {
    console.error(`Parent Task not found: ${task.parentId}`)
    return
  }
  parent.subtasks = parent.subtasks.filter(task => task.id !== taskId)
}

export const tasksQueryKey = 'tasks'

export const useTaskQuery = (taskId?: string) => {
  return useQuery({
    queryKey: [tasksQueryKey],
    enabled: !!taskId,
    queryFn: async () => {
      if (!taskId) {
        return undefined
      }

      /* TODO update later
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
        status: res.getStatus(),
        notes: res.getDescription(),
        isPublicVisible: res.getPublic(),
        assignee: res.getAssignedUserId(),
        dueDate: dueAt ? timestampToDate(dueAt) : undefined,
        subtasks: res.getSubtasksList().map(subtask => ({
          id: subtask.getId(),
          name: subtask.getName(),
          isDone: subtask.getDone()
        }))
      }

      return task
      */

      return findTask(taskId)
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

      /* TODO update later
      const req = new GetTasksByPatientRequest()
      req.setPatientId(patientId)

      const res = await taskService.getTasksByPatient(req, getAuthenticatedGrpcMetadata())

      if (!res.getTasksList()) {
        console.error('TasksByPatient query failed')
      }

      const tasks: Task[] = res.getTasksList().map(task => {
        const dueAt = task.getDueAt()
        return {
          id: task.getId(),
          name: task.getName(),
          status: task.getStatus(),
          notes: task.getDescription(),
          isPublicVisible: task.getPublic(),
          assignee: task.getAssignedUserId(),
          dueDate: dueAt ? timestampToDate(dueAt) : undefined,
          subtasks: task.getSubtasksList().map(subtask => ({
            id: subtask.getId(),
            name: subtask.getName(),
            isDone: subtask.getDone()
          }))
        }
      })
      return tasks
      */
      return localTasks
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

      /* TODO update later
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
          dueDate: dueAt ? timestampToDate(dueAt) : undefined,
          subtasks: task.getSubtasksList().map(subtask => ({
            id: subtask.getId(),
            name: subtask.getName(),
            isDone: subtask.getDone()
          }))
        }
      }

      const tasks: SortedTasks = {
        [TaskStatus.TASK_STATUS_TODO]: res.getTodoList().map(value => mapping(value, TaskStatus.TASK_STATUS_TODO)),
        [TaskStatus.TASK_STATUS_IN_PROGRESS]: res.getInProgressList().map(value => mapping(value, TaskStatus.TASK_STATUS_IN_PROGRESS)),
        [TaskStatus.TASK_STATUS_DONE]: res.getDoneList().map(value => mapping(value, TaskStatus.TASK_STATUS_DONE)),
      }

      return tasks
      */

      return {
        [TaskStatus.TASK_STATUS_TODO]: localTasks.filter(value => value.status === TaskStatus.TASK_STATUS_TODO),
        [TaskStatus.TASK_STATUS_IN_PROGRESS]: localTasks.filter(value => value.status === TaskStatus.TASK_STATUS_IN_PROGRESS),
        [TaskStatus.TASK_STATUS_DONE]: localTasks.filter(value => value.status === TaskStatus.TASK_STATUS_DONE),
      }
    },
  })
}

export const useTaskCreateMutation = (patientId: string, callback: (task: Task) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: Task) => {
      // TODO Delete patientId Check
      if (!patientId) {
        return undefined
      }
      /* TODO update later
      const req = new CreateTaskRequest()
      req.setName(task.name)
      req.setPatientId(patientId)
      req.setDescription(task.notes)
      req.setPublic(task.isPublicVisible)
      req.setInitialStatus(task.status)
      req.setDueAt(task.dueDate ? dateToTimestamp(task.dueDate) : undefined)

      const res = await taskService.createTask(req, getAuthenticatedGrpcMetadata())
      const newTask = {
        ...task,
        id: res.getId()
      }
      */
      const newTask = addTask(task)
      if (newTask) {
        callback(newTask)
      }
      return newTask
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
    }
  })
}

export const useTaskUpdateMutation = (callback: (task: Task) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: Task) => {
      /* TODO update later
      const updateTask = new UpdateTaskRequest()

      updateTask.setId(task.id)
      updateTask.setDescription(task.notes)
      updateTask.setName(task.name)
      updateTask.setDueAt(task.dueDate ? dateToTimestamp(task.dueDate) : undefined)
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
      */
      const updatedTask = updateTask(task)
      if (updatedTask) {
        callback(updatedTask)
      }
      return updatedTask
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
      /*
      const req = new DeleteTaskRequest()
      req.setId(taskId)
      await taskService.deleteTask(req, getAuthenticatedGrpcMetadata())

      callback()
      return req.toObject()
      */
      deleteTask(taskId)
      callback()
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey, sortedTasksByPatientQueryKey]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
    }
  })
}

export const useAssignTaskToUserMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, userId }: { taskId: string, userId: string }) => {
      /* TODO update later
      const req = new AssignTaskToUserRequest()
      req.setId(taskId)
      req.setUserId(userId)
      const res = await taskService.assignTaskToUser(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in AssignTaskToUser')
      }

      callback()
      return req.toObject()
      */

      const task = findTask(taskId)
      if (task) {
        updateTask({ ...task, assignee: userId })
        callback()
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
    }
  })
}

export const useUnassignTaskMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      /* TODO update later
      const req = new UnassignTaskFromUserRequest()
      req.setId(taskId)
      const res = await taskService.unassignTaskFromUser(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in UnAssignTaskToUser')
      }

      callback()
      return req.toObject()
      */
      const task = findTask(taskId)
      if (task) {
        updateTask({ ...task, assignee: '' })
        callback()
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries([tasksQueryKey]).then()
    }
  })
}
