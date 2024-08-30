import type { Metadata } from 'grpc-web'
import type {
  BulkCreateBedsRequest,
  CreateBedRequest,
  DeleteBedRequest,
  GetBedByPatientRequest,
  GetBedRequest,
  GetBedsByRoomRequest,
  GetBedsRequest,
  UpdateBedRequest

} from '@helpwave/proto-ts/services/task_svc/v1/bed_svc_pb'
import {
  BulkCreateBedsResponse,
  CreateBedResponse,
  DeleteBedResponse,
  GetBedResponse,
  GetBedsByRoomResponse,
  GetBedsResponse,
  UpdateBedResponse
  ,
  GetBedByPatientResponse
} from '@helpwave/proto-ts/services/task_svc/v1/bed_svc_pb'
import { BedServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/bed_svc_grpc_web_pb'
import { range } from '@helpwave/common/util/array'
import { OfflineValueStore } from '@/mutations/offline/value_store'
import type { BedWithRoomId } from '@/mutations/bed_mutations'
import { PatientOfflineService } from '@/mutations/offline/services/patient_service'
import { RoomOfflineService } from '@/mutations/offline/services/room_service'

export const BedOfflineService = {
  find: (id: string): BedWithRoomId | undefined => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.beds.find(value => value.id === id)
  },
  findMany: (roomId?: string): BedWithRoomId[] => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.beds.filter(value => !roomId || value.roomId === roomId)
  },
  addBed: (bed: BedWithRoomId) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    return valueStore.beds.push(bed)
  },
  updateBed: (bed: BedWithRoomId) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    let found = false

    // TODO check organization
    valueStore.beds = valueStore.beds.map(value => {
      if (value.id === bed.id) {
        found = true
        return {
          ...value,
          name: bed.name
        }
      }
      return value
    })

    if (!found) {
      throw Error(`UpdateBed: Could not find bed with id ${bed.id}`)
    }
  },
  delete: (id: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.beds = valueStore.beds.filter(value => value.id !== id)
    const patient = PatientOfflineService.findByBed(id)
    if (patient) {
      PatientOfflineService.unassignBed(patient.id)
    }
  }
}

export class BedOfflineServicePromiseClient extends BedServicePromiseClient {
  async getBed(request: GetBedRequest, _?: Metadata): Promise<GetBedResponse> {
    const bed = BedOfflineService.find(request.getId())
    if (!bed) {
      throw Error(`GetBed: Could not find bed with id ${request.getId()}`)
    }

    return new GetBedResponse()
      .setId(bed.id)
      .setName(bed.name)
      .setRoomId(bed.roomId)
  }

  async getBeds(_: GetBedsRequest, __?: Metadata): Promise<GetBedsResponse> {
    const beds = BedOfflineService.findMany()

    const list = beds.map(bed => new GetBedsResponse.Bed()
      .setId(bed.id)
      .setName(bed.name)
      .setRoomId(bed.roomId)
    )

    return new GetBedsResponse()
      .setBedsList(list)
  }

  async getBedsByRoom(request: GetBedsByRoomRequest, _?: Metadata): Promise<GetBedsByRoomResponse> {
    const beds = BedOfflineService.findMany(request.getRoomId())

    const list = beds.map(bed => new GetBedsByRoomResponse.Bed()
      .setId(bed.id)
      .setName(bed.name)
    )

    return new GetBedsByRoomResponse()
      .setBedsList(list)
  }

  async getBedByPatient(request: GetBedByPatientRequest, _?: Metadata): Promise<GetBedByPatientResponse> {
    const patient = PatientOfflineService.find(request.getPatientId())
    if (!patient) {
      throw Error(`GetBedByPatient: Could not find patient with id ${request.getPatientId()}`)
    }
    if (!patient.bedId) {
      return new GetBedByPatientResponse()
    }
    const bed = BedOfflineService.find(patient.bedId)
    if (!bed) {
      return new GetBedByPatientResponse()
    }
    const room = RoomOfflineService.findRoom(bed.roomId)
    if (!room) {
      return new GetBedByPatientResponse()
    }
    return new GetBedByPatientResponse()
      .setBed(new GetBedByPatientResponse.Bed().setId(bed.id).setName(bed.name))
      .setRoom(new GetBedByPatientResponse.Room().setId(room.id).setName(room.id).setWardId(room.wardId))
  }

  async createBed(request: CreateBedRequest, _?: Metadata): Promise<CreateBedResponse> {
    const newBed: BedWithRoomId = {
      id: Math.random().toString(),
      name: request.getName(),
      roomId: request.getRoomId()
    }

    BedOfflineService.addBed(newBed)

    return new CreateBedResponse().setId(newBed.id)
  }

  async bulkCreateBeds(request: BulkCreateBedsRequest, _?: Metadata): Promise<BulkCreateBedsResponse> {
    const roomId = request.getRoomId() // TODO check existence
    const beds: BedWithRoomId[] = range(0, request.getAmountOfBeds() - 1).map(value => ({
      id: Math.random().toString(),
      name: `Bed ${value + 1}`,
      roomId,
    }))

    for (const bed of beds) {
      BedOfflineService.addBed(bed)
    }

    const list = beds.map(bed => new BulkCreateBedsResponse.Bed()
      .setId(bed.id)
      .setName(bed.name))

    return new BulkCreateBedsResponse().setBedsList(list)
  }

  async updateBed(request: UpdateBedRequest, _?: Metadata): Promise<UpdateBedResponse> {
    const bed: BedWithRoomId = {
      id: request.getId(),
      name: request.getName(),
      roomId: request.getRoomId()
    }

    BedOfflineService.updateBed(bed)

    return new UpdateBedResponse()
  }

  async deleteBed(request: DeleteBedRequest, _?: Metadata): Promise<DeleteBedResponse> {
    BedOfflineService.delete(request.getId())
    return new DeleteBedResponse()
  }
}