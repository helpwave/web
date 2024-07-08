import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateRoomRequest,
  DeleteRoomRequest,
  GetRoomOverviewsByWardRequest,
  GetRoomRequest,
  UpdateRoomRequest
} from '@helpwave/proto-ts/services/task_svc/v1/room_svc_pb'
import { noop } from '@helpwave/common/util/noop'
import type { BedDTO, BedWithPatientWithTasksNumberDTO, BedWithMinimalPatientDTO } from './bed_mutations'
import { wardsQueryKey } from './ward_mutations'
import { getAuthenticatedGrpcMetadata, roomService } from '@/utils/grpc'

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

export const useRoomQuery = (roomId?: string) => {
  return useQuery({
    queryKey: [roomsQueryKey, roomId],
    enabled: !!roomId,
    queryFn: async () => {
      const req = new GetRoomRequest()
      if (roomId) {
        req.setId(roomId)
      }
      const res = await roomService.getRoom(req, getAuthenticatedGrpcMetadata())

      const room: RoomDTO = {
        id: res.getId(),
        name: res.getName(),
        beds: res.getBedsList().map(bed => ({
          id: bed.getId(),
          name: bed.getName()
        }))
      }

      return room
    },
  })
}

export const roomOverviewsQueryKey = 'roomOverview'
export const useRoomOverviewsQuery = (wardId: string | undefined) => {
  return useQuery({
    queryKey: [roomsQueryKey, roomOverviewsQueryKey],
    enabled: !!wardId,
    queryFn: async () => {
      const req = new GetRoomOverviewsByWardRequest()
      if (wardId) {
        req.setId(wardId)
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
      queryClient.invalidateQueries([roomsQueryKey]).then()
    },
  })
}

export const useRoomCreateMutation = (callback: (room: RoomMinimalDTO) => void = noop, wardId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (room: RoomMinimalDTO) => {
      const req = new CreateRoomRequest()
      req.setWardId(wardId)
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
      queryClient.refetchQueries([roomsQueryKey]).then()
      queryClient.refetchQueries([wardsQueryKey]).then()
    }
  })
}

export const useRoomDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (roomId: string) => {
      const req = new DeleteRoomRequest()
      req.setId(roomId)
      const res = await roomService.deleteRoom(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('RoomDelete failed')
      }

      callback()
      return req.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([roomsQueryKey]).then()
      queryClient.refetchQueries([wardsQueryKey]).then()
    }
  })
}
