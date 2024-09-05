import type { Metadata } from 'grpc-web'
import { TaskServicePromiseClient } from '@helpwave/proto-ts/services/tasks_svc/v1/task_svc_grpc_web_pb'
import type {
  AssignTaskRequest,
  CreateTaskRequest,
  GetAssignedTasksRequest,
  GetTaskRequest,
  GetTasksByPatientRequest,
  GetTasksByPatientSortedByStatusRequest,
  UpdateTaskRequest
  ,
  AssignTaskResponse,
  UnassignTaskRequest,
  CreateSubtaskRequest,
  UpdateSubtaskRequest,
  CompleteSubtaskRequest,
  UncompleteSubtaskRequest, DeleteSubtaskRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/task_svc_pb'
import {
  CompleteSubtaskResponse,
  CreateSubtaskResponse,
  CreateTaskResponse, DeleteSubtaskResponse,
  GetAssignedTasksResponse,
  GetTaskResponse,
  GetTasksByPatientResponse,
  GetTasksByPatientSortedByStatusResponse, UnassignTaskResponse, UncompleteSubtaskResponse, UpdateSubtaskResponse,
  UpdateTaskResponse
} from '@helpwave/proto-ts/services/tasks_svc/v1/task_svc_pb'
import { AssignTaskToUserResponse } from '@helpwave/proto-ts/services/task_svc/v1/task_svc_pb'
import type { SubTaskValueStore, TaskValueStore } from '../value_store'
import type { SubTaskDTO, TaskStatus } from '../../types/tasks/task'
import { OfflineValueStore } from '../value_store'
import { GRPCConverter } from '../../util/util'
import { PatientOfflineService } from './patient_service'

type TaskValueStoreUpdate =
  Pick<TaskValueStore, 'id'>
  & Partial<Pick<TaskValueStore, 'name' | 'notes' | 'dueDate' | 'status'>>

type SubTaskValueStoreUpdate = Omit<SubTaskDTO, 'isDone'>

export const SubTaskOfflineService = {
  find: (id: string): SubTaskValueStore | undefined => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.subTasks.find(value => value.id === id)
  },
  findSubTasks: (taskId?: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    return valueStore.subTasks.filter(value => !taskId || value.taskId === taskId)
  },
  create: (taskId: string, subTask: SubTaskValueStore) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.subTasks.push(subTask)
  },
  update: (subTask: SubTaskValueStoreUpdate) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.subTasks = valueStore.subTasks.map(value => value.id === subTask.id ? { ...value, ...subTask } : value)
  },
  updateStatus: (subTaskId: string, isDone: boolean) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.subTasks = valueStore.subTasks.map(value => value.id === subTaskId ? {
      ...value,
      isDone
    } : value)
  },
  delete: (subTaskId: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.subTasks = valueStore.subTasks.filter(value => subTaskId !== value.id)
  }
}

export const TaskOfflineService = {
  find: (id: string): TaskValueStore | undefined => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.tasks.find(value => value.id === id)
  },
  findTasks: (patientId?: string): TaskValueStore[] => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.tasks.filter(value => !patientId || value.patientId === patientId)
  },
  create: (task: TaskValueStore) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    return valueStore.tasks.push(task)
  },
  updateTaskWithUpdater: (taskId: string, updater: (task: TaskValueStore) => void) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    let found = false

    // TODO check organization
    valueStore.tasks = valueStore.tasks.map(value => {
      if (value.id === taskId) {
        found = true
        const newTask: TaskValueStore = { ...value }
        updater(newTask)
        return newTask
      }
      return value
    })

    if (!found) {
      throw Error(`U-pdateTaskWithUpdater: Could not find task with id ${taskId}`)
    }
  },
  updateTaskStorage: (task: TaskValueStoreUpdate) => {
    TaskOfflineService.updateTaskWithUpdater(task.id, task1 => {
      task1.name = task.name ?? task1.name
      task1.notes = task.notes ?? task1.notes
      task1.dueDate = task.dueDate ?? task1.dueDate
      task1.status = task.status ?? task1.status
    })
  },
  changeTaskStatus: (taskId: string, taskStatus: TaskStatus) => {
    TaskOfflineService.updateTaskWithUpdater(taskId, task1 => {
      task1.status = taskStatus
    })
  },
  changeAssignment: (taskId: string, assignee?: string) => {
    TaskOfflineService.updateTaskWithUpdater(taskId, task1 => {
      task1.assignee = assignee
    })
  },
  changePublicity: (taskId: string, isPublic: boolean) => {
    TaskOfflineService.updateTaskWithUpdater(taskId, task1 => {
      task1.isPublicVisible = isPublic
    })
  },
  delete: (id: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.tasks = valueStore.tasks.filter(value => value.id !== id)
    const subTasks = SubTaskOfflineService.findSubTasks(id)
    subTasks.forEach(subTask => SubTaskOfflineService.delete(subTask.id))
  },
}

export class TaskOfflineServicePromiseClient extends TaskServicePromiseClient {
  async getTask(request: GetTaskRequest, _?: Metadata): Promise<GetTaskResponse> {
    const task = TaskOfflineService.find(request.getId())
    if (!task) {
      throw Error(`FindTask: Could not find task with id ${request.getId()}`)
    }
    const list = SubTaskOfflineService.findSubTasks(task.id).map(subtask => new GetTaskResponse.Subtask()
      .setId(subtask.id)
      .setName(subtask.name)
      .setDone(subtask.isDone)
    )
    const patient = PatientOfflineService.find(task.patientId)
    if (!patient) {
      throw Error(`FindTask: Could not find patient with id ${task.patientId} for task`)
    }

    const res = new GetTaskResponse()
      .setId(task.id)
      .setName(task.name)
      .setDescription(task.notes)
      .setStatus(GRPCConverter.taskStatusToGrpc(task.status))
      .setCreatedAt(GRPCConverter.dateToTimestamp(task.createdAt))
      .setSubtasksList(list)

    if (task.assignee) {
      res.setAssignedUserId(task.assignee)
    }
    return res
  }

  async getTasksByPatient(request: GetTasksByPatientRequest, _?: Metadata): Promise<GetTasksByPatientResponse> {
    const tasks = TaskOfflineService.findTasks(request.getPatientId())
    const list = tasks.map(task => {
      const res = new GetTasksByPatientResponse.Task()
        .setId(task.id)
        .setName(task.name)
        .setDescription(task.notes)
        .setPublic(task.isPublicVisible)
        .setStatus(GRPCConverter.taskStatusToGrpc(task.status))
        .setDueAt(task.dueDate ? GRPCConverter.dateToTimestamp(task.dueDate) : undefined)
        .setCreatedBy(task.creatorId)
        .setPatientId(request.getPatientId())
        .setCreatedAt(GRPCConverter.dateToTimestamp(task.createdAt))
        .setSubtasksList(SubTaskOfflineService.findSubTasks(task.id).map(subtask => new GetTasksByPatientResponse.Task.SubTask()
          .setId(subtask.id)
          .setName(subtask.name)
          .setDone(subtask.isDone)
        ))
      if (task.assignee) {
        res.setAssignedUserId(task.assignee)
      }
      return res
    }
    )

    return new GetTasksByPatientResponse().setTasksList(list)
  }

  async getTasksByPatientSortedByStatus(request: GetTasksByPatientSortedByStatusRequest, _?: Metadata): Promise<GetTasksByPatientSortedByStatusResponse> {
    const tasks = TaskOfflineService.findTasks(request.getPatientId())
    const mapper = (task: TaskValueStore) => {
      const res = new GetTasksByPatientSortedByStatusResponse.Task()
        .setId(task.id)
        .setName(task.name)
        .setDescription(task.notes)
        .setPublic(task.isPublicVisible)
        .setDueAt(task.dueDate ? GRPCConverter.dateToTimestamp(task.dueDate) : undefined)
        .setCreatedBy(task.creatorId)
        .setPatientId(request.getPatientId())
        .setCreatedAt(GRPCConverter.dateToTimestamp(task.createdAt))
        .setSubtasksList(SubTaskOfflineService.findSubTasks(task.id).map(subtask => new GetTasksByPatientSortedByStatusResponse.Task.SubTask()
          .setId(subtask.id)
          .setName(subtask.name)
          .setDone(subtask.isDone)
        ))
      if (task.assignee) {
        res.setAssignedUserId(task.assignee)
      }
      return res
    }
    const todo = tasks.filter(value => value.status === 'todo').map(mapper)
    const inProgress = tasks.filter(value => value.status === 'inProgress').map(mapper)
    const done = tasks.filter(value => value.status === 'done').map(mapper)

    return new GetTasksByPatientSortedByStatusResponse()
      .setTodoList(todo)
      .setInProgressList(inProgress)
      .setDoneList(done)
  }

  async getAssignedTasks(_: GetAssignedTasksRequest, __?: Metadata): Promise<GetAssignedTasksResponse> {
    const tasks = TaskOfflineService.findTasks() // TODO filter by assignee
    const list = tasks.map(task => {
      const patient = PatientOfflineService.find(task.patientId)
      if (!patient) {
        throw Error(`GetAssignedTasks: Could not find patient with id ${task.patientId} for task with id ${task.id}`)
      }
      const res = new GetAssignedTasksResponse.Task()
        .setId(task.id)
        .setName(task.name)
        .setDescription(task.notes)
        .setPublic(task.isPublicVisible)
        .setStatus(GRPCConverter.taskStatusToGrpc(task.status))
        .setDueAt(task.dueDate ? GRPCConverter.dateToTimestamp(task.dueDate) : undefined)
        .setCreatedBy(task.creatorId)
        .setPatient(new GetAssignedTasksResponse.Task.Patient().setId(patient.id).setName(patient.name))
        .setSubtasksList(SubTaskOfflineService.findSubTasks(task.id).map(subtask => new GetAssignedTasksResponse.Task.SubTask()
          .setId(subtask.id)
          .setName(subtask.name)
          .setDone(subtask.isDone)
        ))
      if (task.assignee) {
        res.setAssignedUserId(task.assignee)
      }
      return res
    }
    )
    return new GetAssignedTasksResponse().setTasksList(list)
  }

  async createTask(request: CreateTaskRequest, _?: Metadata): Promise<CreateTaskResponse> {
    const newTask: TaskValueStore = {
      id: Math.random().toString(),
      name: request.getName(),
      notes: request.getDescription(),
      patientId: request.getPatientId(),
      creatorId: 'CreatorId', // TODO fix TaskOfflineService
      dueDate: request.getDueAt() ? GRPCConverter.timestampToDate(request.getDueAt()!) : undefined,
      status: GRPCConverter.taskStatusFromGRPC(request.getInitialStatus()),
      isPublicVisible: request.getPublic(),
      createdAt: new Date(),
    }

    TaskOfflineService.create(newTask)

    return new CreateTaskResponse().setId(newTask.id)
  }

  async updateTask(request: UpdateTaskRequest, _?: Metadata): Promise<UpdateTaskResponse> {
    const task: TaskValueStoreUpdate = {
      id: request.getId(),
      name: request.hasName() ? request.getName() : undefined,
      notes: request.hasDescription() ? request.getDescription() : undefined,
      dueDate: request.hasDueAt() ? GRPCConverter.timestampToDate(request.getDueAt()!) : undefined,
      status: request.hasStatus() ? GRPCConverter.taskStatusFromGRPC(request.getStatus()) : undefined
    }

    TaskOfflineService.updateTaskStorage(task)

    return new UpdateTaskResponse()
  }

  async assignTask(request: AssignTaskRequest, _?: Metadata): Promise<AssignTaskResponse> {
    TaskOfflineService.changeAssignment(request.getTaskId(), request.getUserId()) // TODO check user id
    return new AssignTaskToUserResponse()
  }

  async unassignTask(request: UnassignTaskRequest, _?: Metadata): Promise<UnassignTaskResponse> {
    TaskOfflineService.changeAssignment(request.getTaskId())
    return new UnassignTaskResponse()
  }

  /* not allowed anymore maybe reenable later
  async deleteTask(request: DeleteTaskRequest, _?: Metadata): Promise<DeleteTaskResponse> {
    TaskOfflineService.delete(request.getId())
    return new DeleteTaskResponse()
  }
   */

  async createSubtask(request: CreateSubtaskRequest, _?: Metadata): Promise<CreateSubtaskResponse> {
    if (!request.getSubtask()) {
      throw Error('CreateSubtask: The Subtask must be set to create a new subtask')
    }
    const subtask: SubTaskValueStore = {
      id: Math.random().toString(),
      taskId: request.getTaskId(),
      name: request.getSubtask()!.getName(),
      isDone: false,
    }

    SubTaskOfflineService.create(request.getTaskId(), subtask)
    return new CreateSubtaskResponse()
  }

  async updateSubtask(request: UpdateSubtaskRequest, _?: Metadata): Promise<UpdateSubtaskResponse> {
    if (!request.getSubtask()) {
      throw Error('UpdateSubtask: The Subtask must be set to update it')
    }
    const update: SubTaskValueStoreUpdate = {
      id: request.getSubtaskId(),
      name: request.getSubtask()!.getName()
    }
    SubTaskOfflineService.update(update)
    return new UpdateSubtaskResponse()
  }

  async completeSubtask(request: CompleteSubtaskRequest, _?: Metadata): Promise<CompleteSubtaskResponse> {
    SubTaskOfflineService.updateStatus(request.getSubtaskId(), true)
    return new CompleteSubtaskResponse()
  }

  async uncompleteSubtask(request: UncompleteSubtaskRequest, _?: Metadata): Promise<UncompleteSubtaskResponse> {
    SubTaskOfflineService.updateStatus(request.getSubtaskId(), false)
    return new UncompleteSubtaskResponse()
  }

  async deleteSubtask(request: DeleteSubtaskRequest, _?: Metadata): Promise<DeleteSubtaskResponse> {
    SubTaskOfflineService.delete(request.getSubtaskId())
    return new DeleteSubtaskResponse()
  }
}
