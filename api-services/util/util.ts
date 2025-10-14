import { TaskStatus as ProtoTaskStatus } from '@helpwave/proto-ts/services/task_svc/v1/task_svc_pb'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
import {
  FieldType as GRPCFieldType,
  SubjectType as GRPCSubjectType
} from '@helpwave/proto-ts/services/property_svc/v1/types_pb'
import type { TaskStatus } from '../types/tasks/task'
import type { FieldType, PropertySubjectType } from '../types/properties/property'

export const GRPCConverter = {
  taskStatusFromGRPC: (status: ProtoTaskStatus): TaskStatus => {
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
  taskStatusToGrpc: (status: TaskStatus): ProtoTaskStatus => {
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
  },
  subjectTypeMapperToGRPC: (subjectType: PropertySubjectType): GRPCSubjectType => {
    switch (subjectType) {
      case 'patient':
        return GRPCSubjectType.SUBJECT_TYPE_PATIENT
      case 'task':
        return GRPCSubjectType.SUBJECT_TYPE_TASK
    }
  },
  subjectTypeMapperFromGRPC: (subjectType: GRPCSubjectType): PropertySubjectType => {
    switch (subjectType) {
      case GRPCSubjectType.SUBJECT_TYPE_PATIENT:
        return 'patient'
      case GRPCSubjectType.SUBJECT_TYPE_TASK:
        return 'task'
      case GRPCSubjectType.SUBJECT_TYPE_UNSPECIFIED:
        throw Error('Unspecified SubjectType')
    }
  },
  fieldTypeMapperToGRPC: (fieldType: FieldType): GRPCFieldType => {
    switch (fieldType) {
      case 'number':
        return GRPCFieldType.FIELD_TYPE_NUMBER
      case 'text':
        return GRPCFieldType.FIELD_TYPE_TEXT
      case 'date':
        return GRPCFieldType.FIELD_TYPE_DATE
      case 'dateTime':
        return GRPCFieldType.FIELD_TYPE_DATE_TIME
      case 'checkbox':
        return GRPCFieldType.FIELD_TYPE_CHECKBOX
      case 'singleSelect':
        return GRPCFieldType.FIELD_TYPE_SELECT
      case 'multiSelect':
        return GRPCFieldType.FIELD_TYPE_MULTI_SELECT
      default:
        return GRPCFieldType.FIELD_TYPE_UNSPECIFIED
    }
  },
  fieldTypeMapperFromGRPC: (fieldType: GRPCFieldType): FieldType => {
    switch (fieldType) {
      case GRPCFieldType.FIELD_TYPE_NUMBER:
        return 'number'
      case GRPCFieldType.FIELD_TYPE_TEXT:
        return 'text'
      case GRPCFieldType.FIELD_TYPE_DATE:
        return 'date'
      case GRPCFieldType.FIELD_TYPE_DATE_TIME:
        return 'dateTime'
      case GRPCFieldType.FIELD_TYPE_CHECKBOX:
        return 'checkbox'
      case GRPCFieldType.FIELD_TYPE_SELECT:
        return 'singleSelect'
      case GRPCFieldType.FIELD_TYPE_MULTI_SELECT:
        return 'multiSelect'
      case GRPCFieldType.FIELD_TYPE_UNSPECIFIED:
        throw Error('Unspecified FieldType')
    }
  }
}
