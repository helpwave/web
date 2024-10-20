import type { Metadata } from 'grpc-web'
import { RoomServicePromiseClient } from '@helpwave/proto-ts/services/tasks_svc/v1/room_svc_grpc_web_pb'
import type {
  CreateRoomRequest, DeleteRoomRequest, GetRoomOverviewsByWardRequest,
  GetRoomRequest, GetRoomsRequest, UpdateRoomRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/room_svc_pb'
import {
  CreateRoomResponse, DeleteRoomResponse, GetRoomOverviewsByWardResponse,
  GetRoomResponse,
  GetRoomsResponse, UpdateRoomResponse
} from '@helpwave/proto-ts/services/tasks_svc/v1/room_svc_pb'
import type { RoomWithWardId } from '../../types/tasks/room'
import type { TaskValueStore } from '../value_store'
import { OfflineValueStore } from '../value_store'
import { BedOfflineService } from './bed_service'
import { PatientOfflineService } from './patient_service'
import { TaskOfflineService } from './task_service'

export const RoomOfflineService = {
  findRoom: (id: string): RoomWithWardId => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    const room = valueStore.rooms.find(value => value.id === id)
    if (!room) {
      throw Error(`FindRoom: Could not find room with id ${id}`)
    }
    return room
  },
  findRooms: (wardId?: string): RoomWithWardId[] => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.rooms.filter(value => !wardId || value.wardId === wardId)
  },
  addRoom: (room: RoomWithWardId) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.rooms.push(room)
  },
  updateRoom: (room: RoomWithWardId) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    let found = false

    // TODO check organization
    valueStore.rooms = valueStore.rooms.map(value => {
      if (value.id === room.id) {
        found = true
        return {
          ...value,
          name: room.name
        }
      }
      return value
    })

    if (!found) {
      throw Error(`UpdateRoom: Could not find room with id ${room.id}`)
    }
  },
  delete: (id: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.rooms = valueStore.rooms.filter(value => value.id !== id)
    const beds = BedOfflineService.findMany(id)
    beds.forEach(bed => BedOfflineService.delete(bed.id))
  }
}

export class RoomOfflineServicePromiseClient extends RoomServicePromiseClient {
  async getRoom(request: GetRoomRequest, _?: Metadata): Promise<GetRoomResponse> {
    const room = RoomOfflineService.findRoom(request.getId())

    return new GetRoomResponse()
      .setId(room.id)
      .setName(room.name)
      .setWardId(room.wardId)
      .setBedsList([])
  }

  async getRooms(request: GetRoomsRequest, __?: Metadata): Promise<GetRoomsResponse> {
    const rooms = RoomOfflineService.findRooms(request.hasWardId() ? request.getWardId() : undefined)

    const list = rooms.map(room => new GetRoomsResponse.Room()
      .setId(room.id)
      .setName(room.name)
      .setWardId(room.wardId)
      .setBedsList([])
    )

    return new GetRoomsResponse()
      .setRoomsList(list)
  }

  async getRoomOverviewsByWard(request: GetRoomOverviewsByWardRequest, _?: Metadata): Promise<GetRoomOverviewsByWardResponse> {
    const rooms = RoomOfflineService.findRooms(request.getId())

    const list = rooms.map(room => new GetRoomOverviewsByWardResponse.Room()
      .setId(room.id)
      .setName(room.name)
      .setBedsList(BedOfflineService.findMany(room.id).map(bed => {
        const patient = PatientOfflineService.findByBed(bed.id)
        const tasks: TaskValueStore[] = patient ? TaskOfflineService.findTasks(patient.id) : []
        return new GetRoomOverviewsByWardResponse.Room.Bed()
          .setId(bed.id)
          .setName(bed.name)
          .setPatient(patient ?
            new GetRoomOverviewsByWardResponse.Room.Bed.Patient()
              .setId(patient.id)
              .setHumanReadableIdentifier(patient.name)
              .setTasksUnscheduled(tasks.filter(value => value.status === 'todo').length)
              .setTasksInProgress(tasks.filter(value => value.status === 'inProgress').length)
              .setTasksDone(tasks.filter(value => value.status === 'done').length)
            : undefined
          )
      }
      )) // TODO fix RoomOfflineService
    )

    return new GetRoomOverviewsByWardResponse()
      .setRoomsList(list)
  }

  async createRoom(request: CreateRoomRequest, _?: Metadata): Promise<CreateRoomResponse> {
    const newRoom: RoomWithWardId = {
      id: Math.random().toString(),
      name: request.getName(),
      wardId: request.getWardId()
    }

    RoomOfflineService.addRoom(newRoom)

    return new CreateRoomResponse().setId(newRoom.id)
  }

  async updateRoom(request: UpdateRoomRequest, _?: Metadata): Promise<UpdateRoomResponse> {
    const room: RoomWithWardId = {
      id: request.getId(),
      name: request.getName(),
      wardId: ''
    }

    RoomOfflineService.updateRoom(room)

    return new UpdateRoomResponse()
  }

  async deleteRoom(request: DeleteRoomRequest, _?: Metadata): Promise<DeleteRoomResponse> {
    RoomOfflineService.delete(request.getId())
    return new DeleteRoomResponse()
  }
}
