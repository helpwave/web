import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import {
  CreateRoomRequest, DeleteRoomRequest,
  GetRoomOverviewsByWardRequest,
  GetRoomRequest, UpdateRoomRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/room_svc_pb'
import type { RoomDTO, RoomMinimalDTO, RoomOverviewDTO } from '../../types/tasks/room'
import type { BedWithPatientWithTasksNumberDTO } from '../../types/tasks/bed'

export const RoomService = {
  get: async (id: string): Promise<RoomDTO> => {
    const req = new GetRoomRequest()
      .setId(id)
    const res = await APIServices.room.getRoom(req, getAuthenticatedGrpcMetadata())

    return {
      id: res.getId(),
      name: res.getName(),
      wardId: res.getWardId(),
      beds: res.getBedsList().map(bed => ({
        id: bed.getId(),
        name: bed.getName()
      }))
    }
  },
  getWardOverview: async (wardId: string): Promise<RoomOverviewDTO[]> => {
    const req = new GetRoomOverviewsByWardRequest()
      .setId(wardId)
    const res = await APIServices.room.getRoomOverviewsByWard(req, getAuthenticatedGrpcMetadata())

    return res.getRoomsList().map((room) => ({
      id: room.getId(),
      name: room.getName(),
      wardId,
      beds: room.getBedsList().map<BedWithPatientWithTasksNumberDTO>(bed => {
        const patient = bed.getPatient()
        return {
          id: bed.getId(),
          name: bed.getName(),
          patient: !patient ? undefined : {
            id: patient.getId(),
            humanReadableIdentifier: patient.getHumanReadableIdentifier(),
            bedId: bed.getId(),
            wardId: wardId,
            tasksTodo: patient.getTasksUnscheduled(),
            tasksInProgress: patient.getTasksInProgress(),
            tasksDone: patient.getTasksDone()
          }
        }
      })
    }))
  },
  create: async (room: RoomMinimalDTO): Promise<RoomMinimalDTO> => {
    const req = new CreateRoomRequest()
      .setWardId(room.wardId)
      .setName(room.name)
    const res = await APIServices.room.createRoom(req, getAuthenticatedGrpcMetadata())
    return { ...room, id: res.getId() }
  },
  update: async (room: RoomMinimalDTO): Promise<boolean> => {
    const req = new UpdateRoomRequest()
      .setId(room.id)
      .setName(room.name)
    await APIServices.room.updateRoom(req, getAuthenticatedGrpcMetadata())
    return true
  },
  delete: async (id: string): Promise<boolean> => {
    const req = new DeleteRoomRequest()
      .setId(id)
    await APIServices.room.deleteRoom(req, getAuthenticatedGrpcMetadata())
    return true
  }
}
