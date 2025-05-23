import type { Metadata } from 'grpc-web'
import { KeycloakService } from '../util/keycloak'

type AuthenticatedGrpcMetadata = {
  Authorization: string,
}

export const getAuthenticatedGrpcMetadata = (): AuthenticatedGrpcMetadata => {
  const token = KeycloakService.getCurrentTokenAndUpdateInBackground()
  return { Authorization: `Bearer ${token}` }
}

export const grpcWrapper = async <ReqMsg, ResMsg>(rpc: (msg: ReqMsg, metadata?: Metadata) => Promise<ResMsg>, msg: ReqMsg, metadata?: Metadata|undefined): Promise<ResMsg> => {
  const token = KeycloakService.getCurrentTokenAndUpdateInBackground()
  return rpc(msg, { Authorization: `Bearer ${token}`, ...metadata })
}
