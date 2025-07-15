import type { TaskDTO } from '../../types/tasks/task'
import { APIServices } from '../../services'
import {
  AssignTaskRequest,
  CreateTaskRequest,
  DeleteTaskRequest,
  GetAssignedTasksRequest,
  GetTaskRequest,
  GetTasksByPatientRequest,
  UnassignTaskRequest,
  UpdateTaskRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/task_svc_pb'
import { GRPCConverter } from '../../util/util'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import { GRPCMapper } from '../../mutations/tasks/util'

export type TaskAssignmentRequestProps = {
  taskId: string,
  userId: string,
}

export const TaskService = {
  get: async function (taskId: string): Promise<TaskDTO> {
    const req = new GetTaskRequest()
    req.setId(taskId)

    const res = await APIServices.task.getTask(req, getAuthenticatedGrpcMetadata())

    if (!res.toObject()) {
      console.error('TasksByPatient query failed')
    }

    return {
      id: res.getId(),
      name: res.getName(),
      notes: res.getDescription(),
      status: GRPCConverter.taskStatusFromGRPC(res.getStatus()),
      assignee: res.getAssignedUserId(),
      subtasks: res.getSubtasksList().map(value => GRPCMapper.subtaskFromGRPC(value, res.getId())),
      creatorId: res.getCreatedBy(),
      createdAt: res.getCreatedAt() ? GRPCConverter.timestampToDate(res.getCreatedAt()!) : new Date(),
      dueDate: res.getDueAt() ? GRPCConverter.timestampToDate(res.getCreatedAt()!) : new Date(),
      isPublicVisible: res.getPublic(),
      patientId: res.getPatient()!.getId(),
      // use res.getCreatedAt()
    }
  },
  getByPatientId: async function (patientId: string): Promise<TaskDTO[]> {
    const req = new GetTasksByPatientRequest()
    req.setPatientId(patientId)

    const res = await APIServices.task.getTasksByPatient(req, getAuthenticatedGrpcMetadata())

    return res.getTasksList().map(task => {
      const dueAt = task.getDueAt()
      return {
        id: task.getId(),
        name: task.getName(),
        status: GRPCConverter.taskStatusFromGRPC(task.getStatus()),
        notes: task.getDescription(),
        isPublicVisible: task.getPublic(),
        assignee: task.getAssignedUserId(),
        dueDate: dueAt ? GRPCConverter.timestampToDate(dueAt) : undefined,
        subtasks: task.getSubtasksList().map(value => GRPCMapper.subtaskFromGRPC(value, task.getId())),
        creationDate: task.getCreatedAt() ? GRPCConverter.timestampToDate(task.getCreatedAt()!) : undefined,
        creatorId: task.getCreatedBy(),
        patientId: task.getPatientId(),
      }
    })
  },
  getMyTasks: async function (): Promise<TaskDTO[]> {
    const req = new GetAssignedTasksRequest()

    const res = await APIServices.task.getAssignedTasks(req, getAuthenticatedGrpcMetadata())

    return res.getTasksList().map(task => {
      const dueAt = task.getDueAt()
      return {
        id: task.getId(),
        name: task.getName(),
        status: GRPCConverter.taskStatusFromGRPC(task.getStatus()),
        notes: task.getDescription(),
        isPublicVisible: task.getPublic(),
        assignee: task.getAssignedUserId(),
        dueDate: dueAt ? GRPCConverter.timestampToDate(dueAt) : undefined,
        subtasks: task.getSubtasksList().map(value => GRPCMapper.subtaskFromGRPC(value, task.getId())),
        creationDate: task.getCreatedAt() ? GRPCConverter.timestampToDate(task.getCreatedAt()!) : undefined,
        creatorId: task.getCreatedBy(),
        patientId: task.getPatient()!.getId(),
      }
    })
  },
  create: async function (task: TaskDTO): Promise<TaskDTO> {
    const req = new CreateTaskRequest()
      .setName(task.name)
      .setPatientId(task.patientId)
      .setDescription(task.notes)
      .setPublic(task.isPublicVisible)
      .setInitialStatus(GRPCConverter.taskStatusToGrpc(task.status))
      .setDueAt(task.dueDate ? GRPCConverter.dateToTimestamp(task.dueDate) : undefined)
      .setSubtasksList(task.subtasks.map(subtask => (new CreateTaskRequest.SubTask())
        .setName(subtask.name)
        .setDone(subtask.isDone)))

    if (task.assignee) {
      req.setAssignedUserId(task.assignee)
    }

    const res = await APIServices.task.createTask(req, getAuthenticatedGrpcMetadata())
    return {
      ...task,
      id: res.getId()
    }
  },
  update: async function (task: TaskDTO): Promise<boolean> {
    const req = new UpdateTaskRequest()
      .setId(task.id)
      .setDescription(task.notes)
      .setName(task.name)
      .setDueAt(task.dueDate ? GRPCConverter.dateToTimestamp(task.dueDate) : undefined)
      .setStatus(GRPCConverter.taskStatusToGrpc(task.status))

    const res = await APIServices.task.updateTask(req, getAuthenticatedGrpcMetadata())

    return !!res.toObject()
  },
  delete: async function (taskId: string): Promise<boolean> {
    const req = new DeleteTaskRequest()
      .setId(taskId)
    await APIServices.task.deleteTask(req, getAuthenticatedGrpcMetadata())
    return !!req.toObject()
  },
  assign: async function ({ taskId, userId }: TaskAssignmentRequestProps): Promise<boolean> {
    const req = new AssignTaskRequest()
      .setTaskId(taskId)
      .setUserId(userId)
    const res = await APIServices.task.assignTask(req, getAuthenticatedGrpcMetadata())
    return !!res.toObject()
  },
  unassign: async function ({ taskId, userId }: TaskAssignmentRequestProps): Promise<boolean> {
    const req = new UnassignTaskRequest()
      .setTaskId(taskId)
      .setUserId(userId)
    const res = await APIServices.task.unassignTask(req, getAuthenticatedGrpcMetadata())
    return !!res.toObject()
  }
}
