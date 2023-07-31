import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateRoomRequest,
  DeleteRoomRequest,
  GetRoomOverviewsByWardRequest,
  UpdateRoomRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/room_svc_pb'
import { getAuthenticatedGrpcMetadata, roomService } from '../utils/grpc'
import type { BedDTO, BedWithPatientWithTasksNumberDTO, BedWithMinimalPatientDTO } from './bed_mutations'
import { wardOverviewsQueryKey, wardsQueryKey } from './ward_mutations'

export const roomsQueryKey = 'rooms'

export type RoomMinimalDTO = {
  id: string,
  name: string
}

export type RoomDTO = RoomMinimalDTO & {
  beds: BedDTO[]
}

export type RoomOverviewDTO = RoomMinimalDTO & {
  beds: BedWithPatientWithTasksNumberDTO[]
}

export const emptyRoomOverview: RoomOverviewDTO = {
  id: '',
  name: '',
  beds: []
}

export type RoomWithMinimalBedAndPatient = RoomMinimalDTO & {
  beds: BedWithMinimalPatientDTO[]
}

export const useRoomQuery = () => {
  return useQuery({
    queryKey: [roomsQueryKey],
    queryFn: async () => {
      // TODO fetch user rooms
      return [] as RoomDTO[]
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
            name: bed.getName(),
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
        console.error('RoomCreate failed')
      }

      room.id = res.getId()
      callback(room)
      return room
    },
    onSuccess: () => {
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
    }
  })
}

export const useRoomDeleteMutation = (callback: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (roomUUID: string) => {
      const req = new DeleteRoomRequest()
      req.setId(roomUUID)
      const res = await roomService.deleteRoom(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('RoomDelete failed')
      }

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      queryClient.refetchQueries([wardsQueryKey, wardOverviewsQueryKey]).then()
    }
  })
}
