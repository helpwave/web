import type { Metadata } from 'grpc-web'
import { KeycloakService } from '../util/keycloak'

type AuthenticatedGrpcMetadata = {
  Authorization: string
}

const defaultOrganization = `3b25c6f5-4705-4074-9fc6-a50c28eba406`
export const getAuthenticatedGrpcMetadata = (_: string = defaultOrganization): AuthenticatedGrpcMetadata => {
  const token = KeycloakService.getCurrentTokenAndUpdateInBackground()
  return { Authorization: `Bearer ${token}` }
}

export const grpcWrapper = async <ReqMsg, ResMsg>(rpc: (msg: ReqMsg, metadata?: Metadata) => Promise<ResMsg>, msg: ReqMsg, metadata?: Metadata|undefined): Promise<ResMsg> => {
  const token = KeycloakService.getCurrentTokenAndUpdateInBackground()
  return rpc(msg, { Authorization: `Bearer ${token}`, ...metadata })
}
