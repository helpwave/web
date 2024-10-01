import { WardServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/ward_svc_grpc_web_pb'
import type {
  CreateWardRequest,
  DeleteWardRequest,
  GetRecentWardsRequest,
  GetWardDetailsRequest,
  GetWardOverviewsRequest,
  GetWardRequest,
  GetWardsRequest,
  UpdateWardRequest
} from '@helpwave/proto-ts/services/task_svc/v1/ward_svc_pb'
import {
  CreateWardResponse,
  DeleteWardResponse,
  GetRecentWardsResponse,
  GetWardDetailsResponse,
  GetWardOverviewsResponse,
  GetWardResponse,
  GetWardsResponse,
  UpdateWardResponse
} from '@helpwave/proto-ts/services/task_svc/v1/ward_svc_pb'
import type { Metadata } from 'grpc-web'
import type { WardWithOrganizationIdDTO } from '../../types/tasks/wards'
import type { PatientValueStore, TaskValueStore } from '../value_store'
import { OfflineValueStore } from '../value_store'
import type { BedWithRoomId } from '../../types/tasks/bed'
import { RoomOfflineService } from './room_service'
import { BedOfflineService } from './bed_service'
import { PatientOfflineService } from './patient_service'
import { TaskOfflineService } from './task_service'

type WardUpdate = Omit<WardWithOrganizationIdDTO, 'organizationId'>

export const WardOfflineService = {
  findWard: (id: string): WardWithOrganizationIdDTO => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    const ward = valueStore.wards.find(value => value.id === id)
    if (!ward) {
      throw Error(`FindWard: Could not find ward with id ${id}`)
    }
    return ward
  },
  findWards: (organizationId?: string): WardWithOrganizationIdDTO[] => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    if (!organizationId) {
      return valueStore.wards
    }
    return valueStore.wards.filter(value => value.organizationId === organizationId)
  },
  create: (ward: WardWithOrganizationIdDTO) => {
    OfflineValueStore.getInstance().wards.push(ward)
  },
  update: (ward: WardUpdate) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()

    let found = false

    // TODO check organization
    valueStore.wards = valueStore.wards.map(value => {
      if (value.id === ward.id) {
        found = true
        return {
          ...value,
          ...ward
        }
      }
      return value
    })

    if (!found) {
      throw Error(`UpdateWard: Could not find ward with id ${ward.id}`)
    }
  },
  delete: (wardId: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.wards = valueStore.wards.filter(value => value.id !== wardId)
    const rooms = RoomOfflineService.findRooms(wardId)
    rooms.forEach(room => RoomOfflineService.delete(room.id))
    // TODO cascade delete to ward-bound templates
  }
}

export class WardOfflineServicePromiseClient extends WardServicePromiseClient {
  async getWard(request: GetWardRequest, _?: Metadata): Promise<GetWardResponse> {
    const ward = WardOfflineService.findWard(request.getId())

    return new GetWardResponse()
      .setName(ward.name)
      .setId(ward.id)
      .setOrganizationId(ward.organizationId)
  }

  async getWardDetails(request: GetWardDetailsRequest, _?: Metadata): Promise<GetWardDetailsResponse> {
    const ward = WardOfflineService.findWard(request.getId())
    const rooms = RoomOfflineService.findRooms(ward.id).map(room => {
      const beds = BedOfflineService.findMany(room.id).map(bed =>
        new GetWardDetailsResponse.Bed()
          .setId(bed.id)
          .setName(bed.name))
      return new GetWardDetailsResponse.Room()
        .setId(room.id)
        .setName(room.name)
        .setBedsList(beds)
    })

    return new GetWardDetailsResponse()
      .setId(ward.id)
      .setName(ward.name)
      .setRoomsList(rooms)
      .setTaskTemplatesList([]) // TODO fix this
  }

  async getWards(_: GetWardsRequest, __?: Metadata): Promise<GetWardsResponse> {
    const wards = WardOfflineService.findWards()

    const res = new GetWardsResponse()
    res.setWardsList(wards.map(value =>
      new GetWardsResponse.Ward().setId(value.id).setName(value.name)
    ))

    return res
  }

  async getWardOverviews(_: GetWardOverviewsRequest, __?: Metadata): Promise<GetWardOverviewsResponse> {
    const wards = WardOfflineService.findWards()
    const list = wards.map(value => {
      const rooms = RoomOfflineService.findRooms(value.id)
      const beds: BedWithRoomId[] = []
      rooms.forEach(room => beds.push(...BedOfflineService.findMany(room.id)))
      const patients: PatientValueStore[] = []
      beds.forEach(bed => {
        const patient = PatientOfflineService.findByBed(bed.id)
        if (patient) {
          patients.push(patient)
        }
      })
      const tasks: TaskValueStore[] = []
      patients.forEach(patient => tasks.push(...TaskOfflineService.findTasks(patient.id)))
      return new GetWardOverviewsResponse.Ward()
        .setId(value.id)
        .setName(value.name)
        .setBedCount(beds.length)
        .setTasksTodo(tasks.filter(task => task.status === 'todo').length)
        .setTasksInProgress(tasks.filter(task => task.status === 'inProgress').length)
        .setTasksDone(tasks.filter(task => task.status === 'done').length)
    }
    )

    return new GetWardOverviewsResponse().setWardsList(list)
  }

  async getRecentWards(_: GetRecentWardsRequest, __?: Metadata): Promise<GetRecentWardsResponse> {
    const wards = WardOfflineService.findWards()
    const list = wards.map(value => {
      const rooms = RoomOfflineService.findRooms(value.id)
      const beds: BedWithRoomId[] = []
      rooms.forEach(room => beds.push(...BedOfflineService.findMany(room.id)))
      const patients: PatientValueStore[] = []
      beds.forEach(bed => {
        const patient = PatientOfflineService.findByBed(bed.id)
        if (patient) {
          patients.push(patient)
        }
      })
      const tasks: TaskValueStore[] = []
      patients.forEach(patient => tasks.push(...TaskOfflineService.findTasks(patient.id)))
      return new GetRecentWardsResponse.Ward()
        .setId(value.id)
        .setName(value.name)
        .setBedCount(beds.length)
        .setTasksTodo(tasks.filter(task => task.status === 'todo').length)
        .setTasksInProgress(tasks.filter(task => task.status === 'inProgress').length)
        .setTasksDone(tasks.filter(task => task.status === 'done').length)
    }
    )

    return new GetRecentWardsResponse().setWardsList(list)
  }

  async createWard(request: CreateWardRequest, _?: Metadata): Promise<CreateWardResponse> {
    const newWard: WardWithOrganizationIdDTO = {
      id: Math.random().toString(),
      name: request.getName(),
      organizationId: 'organization' // TODO check organization
    }

    WardOfflineService.create(newWard)

    return new CreateWardResponse().setId(newWard.id)
  }

  async updateWard(request: UpdateWardRequest, _?: Metadata): Promise<UpdateWardResponse> {
    const update: WardUpdate = {
      id: request.getId(),
      name: request.getName()
    }
    WardOfflineService.update(update)
    return new UpdateWardResponse()
  }

  async deleteWard(request: DeleteWardRequest, _?: Metadata): Promise<DeleteWardResponse> {
    WardOfflineService.delete(request.getId())
    return new DeleteWardResponse()
  }
}
