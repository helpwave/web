import type { BedWithRoomId } from '../../types/tasks/bed'
import {
  CreateBedRequest,
  DeleteBedRequest,
  GetBedRequest,
  UpdateBedRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/bed_svc_pb'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'

export const BedService = {
  get: async (id: string): Promise<BedWithRoomId> => {
    const req = new GetBedRequest()
      .setId(id)
    const res = await APIServices.bed.getBed(req, getAuthenticatedGrpcMetadata())

    return {
      id: res.getId(),
      name: res.getName(),
      roomId: res.getRoomId()
    }
  },
  create: async (bed: BedWithRoomId): Promise<BedWithRoomId> => {
    const req = new CreateBedRequest()
      .setRoomId(bed.roomId)
      .setName(bed.name)
    const res = await APIServices.bed.createBed(req, getAuthenticatedGrpcMetadata())

    return { ...bed, id: res.getId() }
  },
  update: async (bed: BedWithRoomId): Promise<boolean> => {
    const req = new UpdateBedRequest()
      .setId(bed.id)
      .setName(bed.name)
      .setRoomId(bed.roomId)

    await APIServices.bed.updateBed(req, getAuthenticatedGrpcMetadata())
    return true
  },
  delete: async (id: string): Promise<boolean> => {
    const req = new DeleteBedRequest()
    req.setId(id)

    await APIServices.bed.deleteBed(req, getAuthenticatedGrpcMetadata())
    return true
  }
}
