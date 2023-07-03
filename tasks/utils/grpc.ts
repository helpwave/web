import { WardServicePromiseClient } from '@helpwave/proto-ts/proto/services/task_svc/v1/ward_svc_grpc_web_pb'
import { RoomServicePromiseClient } from '@helpwave/proto-ts/proto/services/task_svc/v1/room_svc_grpc_web_pb'
import { BedServicePromiseClient } from '@helpwave/proto-ts/proto/services/task_svc/v1/bed_svc_grpc_web_pb'
import Cookies from 'js-cookie'
import { COOKIE_ID_TOKEN_KEY } from '../hooks/useAuth'
import { Metadata } from 'grpc-web'

// TODO: Implement something like a service registry
export const wardService = new WardServicePromiseClient('https://staging.api.helpwave.de/task-svc')
export const roomService = new RoomServicePromiseClient('https://staging.api.helpwave.de/task-svc')
export const bedService = new BedServicePromiseClient('https://staging.api.helpwave.de/task-svc')

type AuthenticatedGrpcMetadata = {
  Authorization: string,
  'X-Organization': string
}

export const getAuthenticatedGrpcMetadata = (): AuthenticatedGrpcMetadata => {
  // TODO: Implement way better API for get the current id token and DONT hardcode the organization id
  const idToken = Cookies.get(COOKIE_ID_TOKEN_KEY)
  return {
    'Authorization': `Bearer ${idToken}`,
    'X-Organization': `3b25c6f5-4705-4074-9fc6-a50c28eba406`
  }
}
