import type { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import { getAuthenticatedGrpcMetadata, taskService } from '../utils/grpc'
import { useQuery } from '@tanstack/react-query'
import { GetTasksByPatientRequest } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'

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

export const tasksQueryKey = 'tasks'

export const useTasksByPatientQuery = (patientID:string | undefined) => {
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
        console.error('create room failed')
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
