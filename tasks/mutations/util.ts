import { TaskStatus as ProtoTaskStatus } from '@helpwave/proto-ts/services/task_svc/v1/task_svc_pb'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
import type { TaskStatus } from './types/task'

export const GRPCConverter = {
  taskStatusFromGRPC: (status: ProtoTaskStatus) : TaskStatus => {
    switch (status) {
      case ProtoTaskStatus.TASK_STATUS_DONE:
        return 'done'
      case ProtoTaskStatus.TASK_STATUS_IN_PROGRESS:
        return 'inProgress'
      case ProtoTaskStatus.TASK_STATUS_TODO:
        return 'todo'
      default:
        throw Error('Invalid TaskStatus')
    }
  },
  taskStatusToGrpc: (status: TaskStatus) : ProtoTaskStatus => {
    switch (status) {
      case 'done':
        return ProtoTaskStatus.TASK_STATUS_DONE
      case 'inProgress':
        return ProtoTaskStatus.TASK_STATUS_IN_PROGRESS
      case 'todo':
        return ProtoTaskStatus.TASK_STATUS_TODO
    }
  },
  timestampToDate: (timestamp: Timestamp): Date => {
    const seconds = timestamp.getSeconds()
    const nanos = timestamp.getNanos()

    const milliseconds = seconds * 1000 + nanos / 1e6

    return new Date(milliseconds)
  },
  dateToTimestamp: (date: Date): Timestamp => {
    const timestamp = new Timestamp()

    timestamp.setSeconds(Math.floor(date.getTime() / 1000)) // Convert to seconds
    timestamp.setNanos(date.getMilliseconds() * 1e6) // Convert milliseconds to nanoseconds

    return timestamp
  }
}
