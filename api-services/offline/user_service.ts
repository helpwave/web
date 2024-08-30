import type { Metadata } from 'grpc-web'
import { UserServicePromiseClient } from '@helpwave/proto-ts/services/user_svc/v1/user_svc_grpc_web_pb'
import type {
  CreateUserRequest,
  ReadPublicProfileRequest,
  ReadSelfRequest
  , UpdateUserRequest
} from '@helpwave/proto-ts/services/user_svc/v1/user_svc_pb'
import {
  CreateUserResponse,
  ReadPublicProfileResponse,
  ReadSelfOrganization,
  ReadSelfResponse, UpdateUserResponse
} from '@helpwave/proto-ts/services/user_svc/v1/user_svc_pb'
import type { UserValueStore } from '@/mutations/offline/value_store'
import { OfflineValueStore } from '@/mutations/offline/value_store'
import { OrganizationOfflineService } from '@/mutations/offline/services/organization_service'

type UserUpdate = Pick<UserValueStore, 'id'>

export const UserOfflineService = {
  self: (): UserValueStore => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    if (valueStore.users.length === 0) {
      throw Error('Make sure there exists at least one user in the users store')
    }
    return valueStore.users[0]!
  },
  find: (id: string): UserValueStore | undefined => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check user
    return valueStore.users.find(value => value.id === id)
  },
  findUsers: (): UserValueStore[] => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check user
    return valueStore.users
  },
  create: (user: UserValueStore) => {
    OfflineValueStore.getInstance().users.push(user)
  },
  update: (user: UserUpdate) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()

    let found = false

    // TODO check user
    valueStore.users = valueStore.users.map(value => {
      if (value.id === user.id) {
        found = true
        return {
          ...value,
          ...user
        }
      }
      return value
    })

    if (!found) {
      throw Error(`UpdateUser: Could not find user with id ${user.id}`)
    }
  },
  delete: (userId: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.users = valueStore.users.filter(value => value.id !== userId)
  }
}

export class UserOfflineServicePromiseClient extends UserServicePromiseClient {
  async readPublicProfile(request: ReadPublicProfileRequest, _?: Metadata): Promise<ReadPublicProfileResponse> {
    const user = UserOfflineService.find(request.getId())
    if (!user) {
      throw Error(`ReadPublicProfile: Could not find user with id ${request.getId()}`)
    }
    return new ReadPublicProfileResponse()
      .setId(user.id)
      .setName(user.name)
      .setNickname(user.nickName)
      .setAvatarUrl(user.avatarURL)
  }

  async readSelf(_: ReadSelfRequest, __?: Metadata): Promise<ReadSelfResponse> {
    const user = UserOfflineService.self()

    return new ReadSelfResponse()
      .setId(user.id)
      .setName(user.name)
      .setNickname(user.nickName)
      .setAvatarUrl(user.avatarURL)
      .setOrganizationsList(OrganizationOfflineService.findOrganizations().map(org => new ReadSelfOrganization().setId(org.id)))
  }

  async createUser(request: CreateUserRequest, _?: Metadata): Promise<CreateUserResponse> {
    const newUser: UserValueStore = {
      id: Math.random().toString(),
      name: request.getName(),
      nickName: request.getNickname(),
      email: request.getEmail(),
      avatarURL: 'https://helpwave.de/favicon.ico',
    }

    UserOfflineService.create(newUser)

    return new CreateUserResponse().setId(newUser.id)
  }

  async updateUser(request: UpdateUserRequest, _?: Metadata): Promise<UpdateUserResponse> {
    const update: UserUpdate = {
      id: request.getId(),
    }
    UserOfflineService.update(update)
    return new UpdateUserResponse()
  }
}
