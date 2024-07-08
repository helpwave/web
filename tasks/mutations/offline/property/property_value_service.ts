import {
  PropertyValueServicePromiseClient
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_grpc_web_pb'
import type {
  AttachPropertyValueRequest, AttachPropertyValueResponse,
  GetAttachedPropertyValuesRequest,
  GetAttachedPropertyValuesResponse
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_pb'
import type { Metadata } from 'grpc-web'

export class PropertyValueOfflineServicePromiseClient extends PropertyValueServicePromiseClient {
  getAttachedPropertyValues(request: GetAttachedPropertyValuesRequest, metadata?: Metadata): Promise<GetAttachedPropertyValuesResponse> {
    return super.getAttachedPropertyValues(request, metadata)
  }

  attachPropertyValue(request: AttachPropertyValueRequest, metadata?: Metadata): Promise<AttachPropertyValueResponse> {
    return super.attachPropertyValue(request, metadata)
  }
}
