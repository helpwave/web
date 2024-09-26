import { WardServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/ward_svc_grpc_web_pb'
import { RoomServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/room_svc_grpc_web_pb'
import { BedServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/bed_svc_grpc_web_pb'
import { PatientServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/patient_svc_grpc_web_pb'
import { TaskTemplateServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/task_template_svc_grpc_web_pb'
import { TaskServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/task_svc_grpc_web_pb'
import { OrganizationServicePromiseClient } from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_grpc_web_pb'
import { UserServicePromiseClient } from '@helpwave/proto-ts/services/user_svc/v1/user_svc_grpc_web_pb'
import type { Metadata } from 'grpc-web'
import { getConfig } from './config'
import { getCurrentTokenAndUpdateInBackground } from '@/utils/keycloak'

const { apiUrl, fakeToken, fakeTokenEnable } = getConfig()

const taskSvcBaseUrl = `${apiUrl}/task-svc`
const userSvcBaseUrl = `${apiUrl}/user-svc`

// TODO: Implement something like a service registry
export const wardService = new WardServicePromiseClient(taskSvcBaseUrl)
export const roomService = new RoomServicePromiseClient(taskSvcBaseUrl)
export const bedService = new BedServicePromiseClient(taskSvcBaseUrl)
export const patientService = new PatientServicePromiseClient(taskSvcBaseUrl)
export const taskTemplateService = new TaskTemplateServicePromiseClient(taskSvcBaseUrl)
export const taskService = new TaskServicePromiseClient(taskSvcBaseUrl)
export const organizationService = new OrganizationServicePromiseClient(userSvcBaseUrl)
export const userService = new UserServicePromiseClient(userSvcBaseUrl)

type AuthenticatedGrpcMetadata = {
  Authorization: string
}

const defaultOrganization = `3b25c6f5-4705-4074-9fc6-a50c28eba406`
export const getAuthenticatedGrpcMetadata = (_: string = defaultOrganization): AuthenticatedGrpcMetadata => {
  const token = getCurrentTokenAndUpdateInBackground()
  return { Authorization: `Bearer ${token}` }
}

export const grpcWrapper = async <ReqMsg, ResMsg>(rpc: (msg: ReqMsg, metadata?: Metadata) => Promise<ResMsg>, msg: ReqMsg, metadata?: Metadata|undefined): Promise<ResMsg> => {
  const token = getCurrentTokenAndUpdateInBackground()
  return rpc(msg, { Authorization: `Bearer ${token}`, ...metadata })
}
