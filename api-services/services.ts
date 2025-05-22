import { WardServicePromiseClient } from '@helpwave/proto-ts/services/tasks_svc/v1/ward_svc_grpc_web_pb'
import { RoomServicePromiseClient } from '@helpwave/proto-ts/services/tasks_svc/v1/room_svc_grpc_web_pb'
import { BedServicePromiseClient } from '@helpwave/proto-ts/services/tasks_svc/v1/bed_svc_grpc_web_pb'
import { PatientServicePromiseClient } from '@helpwave/proto-ts/services/tasks_svc/v1/patient_svc_grpc_web_pb'
import {
  TaskTemplateServicePromiseClient
} from '@helpwave/proto-ts/services/tasks_svc/v1/task_template_svc_grpc_web_pb'
import { TaskServicePromiseClient } from '@helpwave/proto-ts/services/tasks_svc/v1/task_svc_grpc_web_pb'
import { OrganizationServicePromiseClient } from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_grpc_web_pb'
import { UserServicePromiseClient } from '@helpwave/proto-ts/services/user_svc/v1/user_svc_grpc_web_pb'
import { PropertyServicePromiseClient } from '@helpwave/proto-ts/services/property_svc/v1/property_svc_grpc_web_pb'
import {
  PropertyValueServicePromiseClient
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_grpc_web_pb'
import {
  PropertyViewsServicePromiseClient
} from '@helpwave/proto-ts/services/property_svc/v1/property_views_svc_grpc_web_pb'
import { UpdatesServicePromiseClient } from '@helpwave/proto-ts/services/updates_svc/v1/updates_svc_grpc_web_pb'
import { APIServiceUrls } from './config/wrapper'

type APIServicesType = {
  organization: OrganizationServicePromiseClient,
  user: UserServicePromiseClient,
  ward: WardServicePromiseClient,
  room: RoomServicePromiseClient,
  bed: BedServicePromiseClient,
  patient: PatientServicePromiseClient,
  task: TaskServicePromiseClient,
  taskTemplates: TaskTemplateServicePromiseClient,
  property: PropertyServicePromiseClient,
  propertyValues: PropertyValueServicePromiseClient,
  propertyViewSource: PropertyViewsServicePromiseClient,
  updates: UpdatesServicePromiseClient,
}

const onlineServices: APIServicesType = {
  organization: new OrganizationServicePromiseClient(APIServiceUrls.users),
  user: new UserServicePromiseClient(APIServiceUrls.users),
  ward: new WardServicePromiseClient(APIServiceUrls.tasks),
  room: new RoomServicePromiseClient(APIServiceUrls.tasks),
  bed: new BedServicePromiseClient(APIServiceUrls.tasks),
  patient: new PatientServicePromiseClient(APIServiceUrls.tasks),
  task: new TaskServicePromiseClient(APIServiceUrls.tasks),
  taskTemplates: new TaskTemplateServicePromiseClient(APIServiceUrls.tasks),
  property: new PropertyServicePromiseClient(APIServiceUrls.property),
  propertyValues: new PropertyValueServicePromiseClient(APIServiceUrls.property),
  propertyViewSource: new PropertyViewsServicePromiseClient(APIServiceUrls.property),
  updates: new UpdatesServicePromiseClient(APIServiceUrls.updates)
}

export const APIServices: APIServicesType = onlineServices
