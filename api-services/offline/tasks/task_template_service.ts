import type { Metadata } from 'grpc-web'
import { TaskTemplateServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/task_template_svc_grpc_web_pb'
import type {
  CreateTaskTemplateRequest,
  CreateTaskTemplateSubTaskRequest,
  DeleteTaskTemplateRequest,
  DeleteTaskTemplateSubTaskRequest,
  GetAllTaskTemplatesByCreatorRequest,
  GetAllTaskTemplatesByWardRequest,
  GetAllTaskTemplatesRequest,
  UpdateTaskTemplateRequest,
  UpdateTaskTemplateSubTaskRequest
} from '@helpwave/proto-ts/services/task_svc/v1/task_template_svc_pb'
import {
  CreateTaskTemplateResponse,
  CreateTaskTemplateSubTaskResponse,
  DeleteTaskTemplateResponse,
  DeleteTaskTemplateSubTaskResponse,
  GetAllTaskTemplatesByCreatorResponse,
  GetAllTaskTemplatesByWardResponse,
  GetAllTaskTemplatesResponse,
  UpdateTaskTemplateResponse,
  UpdateTaskTemplateSubTaskResponse
} from '@helpwave/proto-ts/services/task_svc/v1/task_template_svc_pb'
import type { TaskTemplateSubTaskValueStore, TaskTemplateValueStore } from '../value_store'
import { OfflineValueStore } from '../value_store'

type TaskTemplateValueStoreUpdate = Omit<TaskTemplateValueStore, 'isPublicVisible' | 'wardId' | 'creatorId'>

type TaskTemplateSubTaskValueStoreUpdate = Omit<TaskTemplateSubTaskValueStore, 'creatorId' | 'taskTemplateId'>

export class TaskTemplateOfflineServicePromiseClient extends TaskTemplateServicePromiseClient {
  findTaskTemplate(id: string): TaskTemplateValueStore {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    const taskTemplate = valueStore.taskTemplates.find(value => value.id === id)
    if (!taskTemplate) {
      throw Error(`FindTaskTemplate: Could not find taskTemplate with id ${id}`)
    }
    return taskTemplate
  }

  allTaskTemplates(): TaskTemplateValueStore[] {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.taskTemplates
  }

  findTaskTemplatesByWardId(wardId: string): TaskTemplateValueStore[] {
    return this.allTaskTemplates().filter(value => value.wardId === wardId)
  }

  findTaskTemplatesByCreator(creatorId: string): TaskTemplateValueStore[] {
    return this.allTaskTemplates().filter(value => value.creatorId === creatorId)
  }

  addTaskTemplate(taskTemplate: TaskTemplateValueStore) {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    return valueStore.taskTemplates.push(taskTemplate)
  }

  updateTaskTemplateWithUpdater(taskTemplateId: string, updater: (taskTemplate: TaskTemplateValueStore) => void) {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    let found = false

    // TODO check organization
    valueStore.taskTemplates = valueStore.taskTemplates.map(value => {
      if (value.id === taskTemplateId) {
        found = true
        const newTaskTemplate: TaskTemplateValueStore = { ...value }
        updater(newTaskTemplate)
        return newTaskTemplate
      }
      return value
    })

    if (!found) {
      throw Error(`UpdateTaskTemplateWithUpdater: Could not find taskTemplate with id ${taskTemplateId}`)
    }
  }

  updateTaskTemplateStorage(taskTemplate: TaskTemplateValueStoreUpdate) {
    this.updateTaskTemplateWithUpdater(taskTemplate.id, taskTemplate1 => {
      taskTemplate1.name = taskTemplate.name
      taskTemplate1.notes = taskTemplate.notes
    })
  }

  changePublicity(taskTemplateId: string, isPublic: boolean) {
    this.updateTaskTemplateWithUpdater(taskTemplateId, taskTemplate1 => {
      taskTemplate1.isPublicVisible = isPublic
    })
  }

  deleteTaskTemplateInValueStorage(id: string) {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.taskTemplates = valueStore.taskTemplates.filter(value => value.id !== id)
  }

  async getAllTaskTemplates(_: GetAllTaskTemplatesRequest, __?: Metadata): Promise<GetAllTaskTemplatesResponse> {
    const taskTemplates = this.allTaskTemplates()
    const list = taskTemplates.map(taskTemplate => new GetAllTaskTemplatesResponse.TaskTemplate()
      .setId(taskTemplate.id)
      .setName(taskTemplate.name)
      .setDescription(taskTemplate.notes)
      .setIsPublic(taskTemplate.isPublicVisible)
      .setCreatedBy(taskTemplate.creatorId)
      .setSubtasksList(this.findTaskTemplateSubTasks(taskTemplate.id).map(subtaskTemplate => new GetAllTaskTemplatesResponse.TaskTemplate.SubTask()
        .setId(subtaskTemplate.id)
        .setName(subtaskTemplate.name)
        .setTaskTemplateId(taskTemplate.id)
      ))
    )

    return new GetAllTaskTemplatesResponse().setTemplatesList(list)
  }

  async getAllTaskTemplatesByWard(request: GetAllTaskTemplatesByWardRequest, _?: Metadata): Promise<GetAllTaskTemplatesByWardResponse> {
    const taskTemplates = this.findTaskTemplatesByWardId(request.getWardId())
    const list = taskTemplates.map(taskTemplate => new GetAllTaskTemplatesByWardResponse.TaskTemplate()
      .setId(taskTemplate.id)
      .setName(taskTemplate.name)
      .setDescription(taskTemplate.notes)
      .setIsPublic(taskTemplate.isPublicVisible)
      .setCreatedBy(taskTemplate.creatorId)
      .setSubtasksList(this.findTaskTemplateSubTasks(taskTemplate.id).map(subtaskTemplate => new GetAllTaskTemplatesByWardResponse.TaskTemplate.SubTask()
        .setId(subtaskTemplate.id)
        .setName(subtaskTemplate.name)
        .setTaskTemplateId(taskTemplate.id)
      ))
    )

    return new GetAllTaskTemplatesByWardResponse().setTemplatesList(list)
  }

  async getAllTaskTemplatesByCreator(request: GetAllTaskTemplatesByCreatorRequest, _?: Metadata): Promise<GetAllTaskTemplatesByCreatorResponse> {
    const taskTemplates = this.findTaskTemplatesByCreator(request.getCreatedBy())
    const list = taskTemplates.map(taskTemplate => new GetAllTaskTemplatesByCreatorResponse.TaskTemplate()
      .setId(taskTemplate.id)
      .setName(taskTemplate.name)
      .setDescription(taskTemplate.notes)
      .setIsPublic(taskTemplate.isPublicVisible)
      .setSubtasksList(this.findTaskTemplateSubTasks(taskTemplate.id).map(subtaskTemplate => new GetAllTaskTemplatesByCreatorResponse.TaskTemplate.SubTask()
        .setId(subtaskTemplate.id)
        .setName(subtaskTemplate.name)
        .setTaskTemplateId(taskTemplate.id)
      ))
    )

    return new GetAllTaskTemplatesByCreatorResponse().setTemplatesList(list)
  }

  async createTaskTemplate(request: CreateTaskTemplateRequest, _?: Metadata): Promise<CreateTaskTemplateResponse> {
    const newTaskTemplate: TaskTemplateValueStore = {
      id: Math.random().toString(),
      name: request.getName(),
      notes: request.getDescription(),
      creatorId: 'CreatorId', // TODO fix this
      wardId: request.hasWardId() ? request.getWardId() : undefined,
      isPublicVisible: true
    }

    this.addTaskTemplate(newTaskTemplate)
    for (const requestSubTask of request.getSubtasksList()) {
      const subTask: TaskTemplateSubTaskValueStore = {
        id: Math.random().toString(),
        taskTemplateId: newTaskTemplate.id,
        name: requestSubTask.getName(),
        creatorId: 'CreatorId'
      }
      this.addTaskTemplateSubTaskValueStore(subTask)
    }

    return new CreateTaskTemplateResponse().setId(newTaskTemplate.id)
  }

  async updateTaskTemplate(request: UpdateTaskTemplateRequest, _?: Metadata): Promise<UpdateTaskTemplateResponse> {
    const taskTemplate: TaskTemplateValueStoreUpdate = {
      id: request.getId(),
      name: request.getName(),
      notes: request.getDescription(),
    }

    this.updateTaskTemplateStorage(taskTemplate)

    return new UpdateTaskTemplateResponse()
  }

  async deleteTaskTemplate(request: DeleteTaskTemplateRequest, _?: Metadata): Promise<DeleteTaskTemplateResponse> {
    this.deleteTaskTemplateInValueStorage(request.getId())
    return new DeleteTaskTemplateResponse()
  }

  findTaskTemplateSubTask(id: string) {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    const taskTemplateSubTask = valueStore.taskTemplateSubTasks.find(value => value.id === id)
    if (!taskTemplateSubTask) {
      throw Error(`FindTaskTemplateSubTask: Could not find subtaskTemplate with id ${id}`)
    }
    return taskTemplateSubTask
  }

  findTaskTemplateSubTasks(taskTemplateId?: string) {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    return valueStore.taskTemplateSubTasks.filter(value => !taskTemplateId && value.taskTemplateId === taskTemplateId)
  }

  addTaskTemplateSubTaskValueStore(taskTemplateSubTask: TaskTemplateSubTaskValueStore) {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.taskTemplateSubTasks.push(taskTemplateSubTask)
  }

  updateTaskTemplateSubTaskValueStore(taskTemplateSubTask: TaskTemplateSubTaskValueStoreUpdate) {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.taskTemplateSubTasks = valueStore.taskTemplateSubTasks.map(value => value.id === taskTemplateSubTask.id ? { ...value, ...taskTemplateSubTask } : value)
  }

  removeTaskTemplateSubTaskValueStore(taskTemplateSubTaskId: string) {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.taskTemplateSubTasks = valueStore.taskTemplateSubTasks.filter(value => taskTemplateSubTaskId !== value.id)
  }

  async createTaskTemplateSubTask(request: CreateTaskTemplateSubTaskRequest, _?: Metadata): Promise<CreateTaskTemplateSubTaskResponse> {
    const subtaskTemplate: TaskTemplateSubTaskValueStore = {
      id: Math.random().toString(),
      taskTemplateId: request.getTaskTemplateId(),
      name: request.getName(),
      creatorId: 'CreatorId' // TODO fix this
    }

    this.addTaskTemplateSubTaskValueStore(subtaskTemplate)
    return new CreateTaskTemplateSubTaskResponse().setId(subtaskTemplate.id)
  }

  async updateTaskTemplateSubTask(request: UpdateTaskTemplateSubTaskRequest, _?: Metadata): Promise<UpdateTaskTemplateSubTaskResponse> {
    const update: TaskTemplateSubTaskValueStoreUpdate = {
      id: request.getSubtaskId(),
      name: request.getName()
    }
    this.updateTaskTemplateSubTaskValueStore(update)
    return new UpdateTaskTemplateSubTaskResponse()
  }

  async deleteTaskTemplateSubTask(request: DeleteTaskTemplateSubTaskRequest, _?: Metadata): Promise<DeleteTaskTemplateSubTaskResponse> {
    this.removeTaskTemplateSubTaskValueStore(request.getId())
    return new DeleteTaskTemplateSubTaskResponse()
  }
}
