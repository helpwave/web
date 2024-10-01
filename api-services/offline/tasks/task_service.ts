import type { Metadata } from 'grpc-web'
import { TaskServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/task_svc_grpc_web_pb'
import type {
  AddSubTaskRequest,
  AssignTaskToUserRequest,
  CreateTaskRequest,
  DeleteTaskRequest,
  GetAssignedTasksRequest,
  GetTaskRequest,
  GetTasksByPatientRequest,
  GetTasksByPatientSortedByStatusRequest,
  PublishTaskRequest,
  RemoveSubTaskRequest,
  SubTaskToDoneRequest,
  SubTaskToToDoRequest,
  TaskToDoneRequest,
  TaskToInProgressRequest,
  TaskToToDoRequest,
  UnassignTaskFromUserRequest,
  UnpublishTaskRequest,
  UnpublishTaskResponse,
  UpdateSubTaskRequest,
  UpdateTaskRequest
} from '@helpwave/proto-ts/services/task_svc/v1/task_svc_pb'
import {
  AddSubTaskResponse,
  AssignTaskToUserResponse,
  CreateTaskResponse,
  DeleteTaskResponse,
  GetAssignedTasksResponse,
  GetTaskResponse,
  GetTasksByPatientResponse,
  GetTasksByPatientSortedByStatusResponse,
  PublishTaskResponse,
  RemoveSubTaskResponse,
  SubTaskToDoneResponse,
  SubTaskToToDoResponse,
  TaskToDoneResponse,
  TaskToInProgressResponse,
  TaskToToDoResponse,
  UnassignTaskFromUserResponse,
  UpdateSubTaskResponse,
  UpdateTaskResponse
} from '@helpwave/proto-ts/services/task_svc/v1/task_svc_pb'
import type { SubTaskValueStore, TaskValueStore } from '../value_store'
import type { SubTaskDTO, TaskStatus } from '../../types/tasks/task'
import { OfflineValueStore } from '../value_store'
import { GRPCConverter } from '../../util/util'
import { PatientOfflineService } from './patient_service'

type TaskValueStoreUpdate = Omit<TaskValueStore, 'subtasks' | 'status' | 'creationDate' | 'patientId' | 'assigneeId' | 'creatorId' | 'isPublicVisible'>

type SubTaskValueStoreUpdate = Omit<SubTaskDTO, 'isDone'>

export const SubTaskOfflineService = {
  find: (id: string) : SubTaskValueStore | undefined => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.subTasks.find(value => value.id === id)
  },
  findSubTasks: (taskId?: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    return valueStore.subTasks.filter(value => !taskId && value.taskId === taskId)
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
      task1.name = task.name
      task1.notes = task.notes
      task1.dueDate = task.dueDate
    })
  },
  changeTaskStatus: (taskId: string, taskStatus: TaskStatus) => {
    TaskOfflineService.updateTaskWithUpdater(taskId, task1 => {
      task1.status = taskStatus
    })
  },
  changeAssignment: (taskId: string, assignee?: string) => {
    TaskOfflineService.updateTaskWithUpdater(taskId, task1 => {
      task1.assigneeId = assignee
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
    const list = SubTaskOfflineService.findSubTasks(task.id).map(subtask => new GetTaskResponse.SubTask()
      .setId(subtask.id)
      .setName(subtask.name)
      .setDone(subtask.isDone)
      .setCreatedBy('CreatorId') // TODO fix TaskOfflineService
    )
    const patient = PatientOfflineService.find(task.patientId)
    if (!patient) {
      throw Error(`FindTask: Could not find patient with id ${task.patientId} for task`)
    }

    const res = new GetTaskResponse()
      .setId(task.id)
      .setName(task.name)
      .setDescription(task.notes)
      .setPublic(task.isPublicVisible)
      .setStatus(GRPCConverter.taskStatusToGrpc(task.status))
      .setDueAt(task.dueDate ? GRPCConverter.dateToTimestamp(task.dueDate) : undefined)
      .setCreatedBy(task.creatorId)
      .setPatient(new GetTaskResponse.Patient().setId(patient.id).setName(patient.name))
      .setSubtasksList(list)
      .setOrganizationId('organization') // TODO fix TaskOfflineService

    if (task.assigneeId) {
      res.setAssignedUserId(task.assigneeId)
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
        .setSubtasksList(SubTaskOfflineService.findSubTasks(task.id).map(subtask => new GetTaskResponse.SubTask()
          .setId(subtask.id)
          .setName(subtask.name)
          .setDone(subtask.isDone)
          .setCreatedBy('CreatorId') // TODO fix TaskOfflineService
        ))
      if (task.assigneeId) {
        res.setAssignedUserId(task.assigneeId)
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
        .setSubtasksList(SubTaskOfflineService.findSubTasks(task.id).map(subtask => new GetTaskResponse.SubTask()
          .setId(subtask.id)
          .setName(subtask.name)
          .setDone(subtask.isDone)
          .setCreatedBy('CreatorId') // TODO fix TaskOfflineService
        ))
      if (task.assigneeId) {
        res.setAssignedUserId(task.assigneeId)
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
        .setSubtasksList(SubTaskOfflineService.findSubTasks(task.id).map(subtask => new GetTaskResponse.SubTask()
          .setId(subtask.id)
          .setName(subtask.name)
          .setDone(subtask.isDone)
          .setCreatedBy('CreatorId') // TODO fix TaskOfflineService
        ))
      if (task.assigneeId) {
        res.setAssignedUserId(task.assigneeId)
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
    }

    TaskOfflineService.create(newTask)

    return new CreateTaskResponse().setId(newTask.id)
  }

  async updateTask(request: UpdateTaskRequest, _?: Metadata): Promise<UpdateTaskResponse> {
    const task: TaskValueStoreUpdate = {
      id: request.getId(),
      name: request.getName(),
      notes: request.getDescription(),
      dueDate: request.getDueAt() ? GRPCConverter.timestampToDate(request.getDueAt()!) : undefined,
    }

    TaskOfflineService.updateTaskStorage(task)

    return new UpdateTaskResponse()
  }

  async taskToToDo(request: TaskToToDoRequest, _?: Metadata): Promise<TaskToToDoResponse> {
    TaskOfflineService.changeTaskStatus(request.getId(), 'todo')
    return new TaskToToDoResponse()
  }

  async taskToInProgress(request: TaskToInProgressRequest, _?: Metadata): Promise<TaskToInProgressResponse> {
    TaskOfflineService.changeTaskStatus(request.getId(), 'inProgress')
    return new TaskToInProgressResponse()
  }

  async taskToDone(request: TaskToDoneRequest, _?: Metadata): Promise<TaskToDoneResponse> {
    TaskOfflineService.changeTaskStatus(request.getId(), 'done')
    return new TaskToDoneResponse()
  }

  async publishTask(request: PublishTaskRequest, _?: Metadata): Promise<PublishTaskResponse> {
    TaskOfflineService.changePublicity(request.getId(), true)
    return new PublishTaskResponse()
  }

  async unpublishTask(request: UnpublishTaskRequest, _?: Metadata): Promise<UnpublishTaskResponse> {
    TaskOfflineService.changePublicity(request.getId(), false)
    return new PublishTaskResponse()
  }

  async assignTaskToUser(request: AssignTaskToUserRequest, _?: Metadata): Promise<AssignTaskToUserResponse> {
    TaskOfflineService.changeAssignment(request.getId(), request.getUserId()) // TODO check user id
    return new AssignTaskToUserResponse()
  }

  async unassignTaskFromUser(request: UnassignTaskFromUserRequest, _?: Metadata): Promise<UnassignTaskFromUserResponse> {
    TaskOfflineService.changeAssignment(request.getId())
    return new UnassignTaskFromUserResponse()
  }

  async deleteTask(request: DeleteTaskRequest, _?: Metadata): Promise<DeleteTaskResponse> {
    TaskOfflineService.delete(request.getId())
    return new DeleteTaskResponse()
  }

  async addSubTask(request: AddSubTaskRequest, _?: Metadata): Promise<AddSubTaskResponse> {
    const subtask: SubTaskValueStore = {
      id: Math.random().toString(),
      taskId: request.getTaskId(),
      name: request.getName(),
      isDone: request.getDone()
    }

    SubTaskOfflineService.create(request.getTaskId(), subtask)
    return new AddSubTaskResponse()
  }

  async updateSubTask(request: UpdateSubTaskRequest, _?: Metadata): Promise<UpdateSubTaskResponse> {
    const update: SubTaskValueStoreUpdate = {
      id: request.getId(),
      name: request.getName()
    }
    SubTaskOfflineService.update(update)
    return new UpdateSubTaskResponse()
  }

  async subTaskToToDo(request: SubTaskToToDoRequest, _?: Metadata): Promise<SubTaskToToDoResponse> {
    SubTaskOfflineService.updateStatus(request.getId(), true)
    return new SubTaskToToDoResponse()
  }

  async subTaskToDone(request: SubTaskToDoneRequest, _?: Metadata): Promise<SubTaskToDoneResponse> {
    SubTaskOfflineService.updateStatus(request.getId(), false)
    return new SubTaskToDoneResponse()
  }

  async removeSubTask(request: RemoveSubTaskRequest, _?: Metadata): Promise<RemoveSubTaskResponse> {
    SubTaskOfflineService.delete(request.getId())
    return new RemoveSubTaskResponse()
  }
}
