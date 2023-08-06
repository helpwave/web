import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'

export const timestampToDate = (timestamp: Timestamp): Date => {
  const seconds = timestamp.getSeconds()
  const nanos = timestamp.getNanos()

  const milliseconds = seconds * 1000 + nanos / 1e6

  return new Date(milliseconds)
}

export const timestampToDateOptional = (timestamp?: Timestamp): Date | undefined => {
  if (timestamp) {
    return timestampToDate(timestamp)
  }
  return undefined
}

export const dateToTimestamp = (date: Date): Timestamp => {
  const timestamp = new Timestamp()
  timestamp.setSeconds(Math.floor(date.getTime() / 1000)) // Convert to seconds
  timestamp.setNanos(date.getMilliseconds() * 1e6) // Convert milliseconds to nanoseconds
  return timestamp
}

export const dateToTimestampOptional = (date?: Date): Timestamp | undefined => {
  if (date) {
    return dateToTimestamp(date)
  }
  return undefined
}
