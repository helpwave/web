import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateRoomRequest,
  DeleteRoomRequest,
  GetRoomOverviewsByWardRequest,
  UpdateRoomRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/room_svc_pb'
import { getAuthenticatedGrpcMetadata, roomService } from '../utils/grpc'
import type { BedDTO, BedWithPatientWithTasksNumberDTO } from './bed_mutations'
import { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import { wardOverviewsQueryKey, wardsQueryKey } from './ward_mutations'

export const roomsQueryKey = 'rooms'

export type RoomMinimalDTO = {
  id: string,
  name: string
}

export type RoomDTO = {
  id: string,
  name: string,
  beds: BedDTO[]
}

export type RoomOverviewDTO = {
  id: string,
  name: string,
  beds: BedWithPatientWithTasksNumberDTO[]
}

export const emptyRoomOverview = {
  id: '',
  name: '',
  beds: []
}

// TODO remove once backend is implemented
const rooms: RoomDTO[] = [
  {
    id: 'room1',
    name: 'room name 1',
    beds: [
      {
        id: 'bed1',
        index: 1,
        patient: {
          id: 'patient1',
          note: 'Note',
          humanReadableIdentifier: 'Patient A',
          tasks: [
            {
              id: 'task1',
              name: 'Task 1',
              status: TaskStatus.TASK_STATUS_IN_PROGRESS
            },
            {
              id: 'task2',
              name: 'Task 2',
              status: TaskStatus.TASK_STATUS_TODO
            },
            {
              id: 'task3',
              name: 'Task 3',
              status: TaskStatus.TASK_STATUS_DONE
            },
            {
              id: 'task4',
              name: 'Task 4',
              status: TaskStatus.TASK_STATUS_TODO
            },
            {
              id: 'task5',
              name: 'Task 5',
              status: TaskStatus.TASK_STATUS_IN_PROGRESS
            },
            {
              id: 'task6',
              name: 'Task 6',
              status: TaskStatus.TASK_STATUS_DONE
            },
          ]
        }
      },
      {
        id: 'bed2',
        index: 2,
        patient: {
          id: 'patient2',
          note: 'Note',
          humanReadableIdentifier: 'Patient B',
          tasks: [
            {
              id: 'task6',
              name: 'Task 6',
              status: TaskStatus.TASK_STATUS_TODO
            },
            {
              id: 'task7',
              name: 'Task 7',
              status: TaskStatus.TASK_STATUS_TODO
            },
            {
              id: 'task8',
              name: 'Task 8',
              status: TaskStatus.TASK_STATUS_DONE,
            },
            {
              id: 'task9',
              name: 'Task 9',
              status: TaskStatus.TASK_STATUS_TODO,
            },
          ]
        }
      },
      {
        id: 'bed3',
        index: 3,
      },
      {
        id: 'bed4',
        index: 4,
      },
      {
        id: 'bed5',
        index: 5,
      }
    ]
  }
]

export const useRoomQuery = () => {
  return useQuery({
    queryKey: [roomsQueryKey],
    queryFn: async () => {
      // TODO fetch user rooms
      return rooms
    },
  })
}

export const roomOverviewsQueryKey = 'roomOverview'
export const useRoomOverviewsQuery = (wardUUID: string | undefined) => {
  return useQuery({
    queryKey: [roomsQueryKey, roomOverviewsQueryKey],
    enabled: !!wardUUID,
    queryFn: async () => {
      const req = new GetRoomOverviewsByWardRequest()
      if (wardUUID) {
        req.setId(wardUUID)
      }
      const res = await roomService.getRoomOverviewsByWard(req, getAuthenticatedGrpcMetadata())

      const rooms: RoomOverviewDTO[] = res.getRoomsList().map((room) => ({
        id: room.getId(),
        name: room.getName(),
        beds: room.getBedsList().map(bed => {
          const patient = bed.getPatient()
          return {
            id: bed.getId(),
            index: 0, // TODO replace later
            patient: !patient ? undefined : {
              id: patient.getId(),
              name: patient.getHumanReadableIdentifier(),
              tasksUnscheduled: patient.getTasksUnscheduled(),
              tasksInProgress: patient.getTasksInProgress(),
              tasksDone: patient.getTasksDone()
            }
          }
        })
      }))

      return rooms
    },
  })
}

export const useRoomUpdateMutation = (callback: (room: RoomMinimalDTO) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (room: RoomMinimalDTO) => {
      const req = new UpdateRoomRequest()
      req.setId(room.id)
      req.setName(room.name)
      const res = await roomService.updateRoom(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in RoomUpdate')
      }

      callback(room)
      return room
    },
    onSuccess: () => {
      queryClient.invalidateQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
    },
  })
}

export const useRoomCreateMutation = (callback: (room: RoomMinimalDTO) => void, wardUUID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (room: RoomMinimalDTO) => {
      const req = new CreateRoomRequest()
      req.setWardId(wardUUID)
      req.setName(room.name)
      const res = await roomService.createRoom(req, getAuthenticatedGrpcMetadata())

      if (!res.getId()) {
        // TODO some check whether request was successful
        console.error('create room failed')
      }

      room.id = res.getId()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      callback(room)
      return room
    },
  })
}

export const useRoomDeleteMutation = (callback: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (roomUUID: string) => {
      const req = new DeleteRoomRequest()
      req.setId(roomUUID)
      await roomService.deleteRoom(req, getAuthenticatedGrpcMetadata())

      // TODO some check whether request was successful
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      queryClient.refetchQueries([wardsQueryKey, wardOverviewsQueryKey]).then()
      callback()
      return req.toObject()
    },
  })
}
