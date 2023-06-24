import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { WardServicePromiseClient } from '@helpwave/proto-ts/proto/services/task_svc/v1/ward_svc_grpc_web_pb'
import { RoomServicePromiseClient } from '@helpwave/proto-ts/proto/services/task_svc/v1/room_svc_grpc_web_pb'
import { BedServicePromiseClient } from '@helpwave/proto-ts/proto/services/task_svc/v1/bed_svc_grpc_web_pb'
import { CreateWardRequest, GetWardsRequest } from '@helpwave/proto-ts/proto/services/task_svc/v1/ward_svc_pb'
import { GetRoomsByWardRequest } from '@helpwave/proto-ts/proto/services/task_svc/v1/room_svc_pb'
import { GetBedsByRoomRequest } from '@helpwave/proto-ts/proto/services/task_svc/v1/bed_svc_pb'
import { COOKIE_ID_TOKEN_KEY } from '../hooks/useAuth'
import Cookies from 'js-cookie'

const queryKey = 'wards'

type Room = {
  bedCount: number,
  name: string
}

export type WardDTO = {
  id: string,
  name: string,
  rooms: Room[],
  unscheduled: number,
  inProgress: number,
  done: number
}

// TODO remove once backend is implemented
export let wards: WardDTO[] = [
  {
    id: 'ward1',
    name: 'Cardiology',
    rooms: [
      { name: 'Room 1', bedCount: 4 },
      { name: 'Room 2', bedCount: 3 },
      { name: 'Room 3', bedCount: 4 },
      { name: 'Room 4', bedCount: 2 },
      { name: 'Room 5', bedCount: 4 },
      { name: 'Room 6', bedCount: 5 }
    ],
    unscheduled: 1,
    inProgress: 3,
    done: 6
  },
  {
    id: 'ward2',
    name: 'Chirugie',
    rooms: [
      { name: 'Room 1', bedCount: 4 },
      { name: 'Room 2', bedCount: 3 },
      { name: 'Room 3', bedCount: 4 },
      { name: 'Room 4', bedCount: 2 },
      { name: 'Room 5', bedCount: 4 },
      { name: 'Room 6', bedCount: 5 }
    ],
    unscheduled: 1,
    inProgress: 3,
    done: 6
  },
  {
    id: 'ward3',
    name: 'ICU',
    rooms: [
      { name: 'Room 1', bedCount: 4 },
      { name: 'Room 2', bedCount: 3 },
      { name: 'Room 3', bedCount: 4 },
      { name: 'Room 4', bedCount: 2 },
      { name: 'Room 5', bedCount: 4 },
      { name: 'Room 6', bedCount: 5 }
    ],
    unscheduled: 1,
    inProgress: 3,
    done: 6
  },
  {
    id: 'ward4',
    name: 'Radiology',
    rooms: [
      { name: 'Room 1', bedCount: 4 },
      { name: 'Room 2', bedCount: 3 },
      { name: 'Room 3', bedCount: 4 },
      { name: 'Room 4', bedCount: 2 },
      { name: 'Room 5', bedCount: 4 },
      { name: 'Room 6', bedCount: 5 }
    ],
    unscheduled: 1,
    inProgress: 3,
    done: 6
  },
  {
    id: 'ward5',
    name: 'Ward Name 5',
    rooms: [
      { name: 'Room 1', bedCount: 4 },
      { name: 'Room 2', bedCount: 3 },
      { name: 'Room 3', bedCount: 4 },
      { name: 'Room 4', bedCount: 2 },
      { name: 'Room 5', bedCount: 4 },
      { name: 'Room 6', bedCount: 5 }
    ],
    unscheduled: 1,
    inProgress: 3,
    done: 6
  }
]

const wardService = new WardServicePromiseClient('https://staging.api.helpwave.de/task-svc')
const roomService = new RoomServicePromiseClient('https://staging.api.helpwave.de/task-svc')
const bedService = new BedServicePromiseClient('https://staging.api.helpwave.de/task-svc')

export const useWardQuery = () => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const idToken = Cookies.get(COOKIE_ID_TOKEN_KEY)
      const headers = {
        'Authorization': `Bearer ${idToken}`,
        'X-Organization': `3b25c6f5-4705-4074-9fc6-a50c28eba406`
      }

      const getWardsRequest = new GetWardsRequest()
      const getWardsResponse = await wardService.getWards(getWardsRequest, headers)

      const wards = getWardsResponse.getWardsList().map(async (ward) => {
        const getRoomsByWardRequest = new GetRoomsByWardRequest()
        getRoomsByWardRequest.setWardId(ward.getId())
        const getRoomsByWardResponse = await roomService.getRoomsByWard(getRoomsByWardRequest, headers)

        const getRoomsByWardResponses = getRoomsByWardResponse.getRoomsList().map(async (room) => {
          const getBedsByRoomRequest = new GetBedsByRoomRequest()
          getBedsByRoomRequest.setRoomId(room.getId())
          const getBedsByRoomResponse = await bedService.getBedsByRoom(getBedsByRoomRequest, headers)

          return { name: room.getName(), bedCount: getBedsByRoomResponse.getBedsList().length }
        })

        const rooms = await Promise.all(getRoomsByWardResponses)

        return {
          done: 0,
          inProgress: 0,
          unscheduled: 0,
          id: ward.getId(),
          name: ward.getName(),
          rooms: rooms || [],
        } as WardDTO
      })

      return Promise.all(wards)
    },
  })
}

export const useUpdateMutation = (setSelectedWard: (ward:(WardDTO | undefined)) => void, organizationUUID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ward: WardDTO) => {
      // TODO create request for ward
      wards = [...wards.filter(value => value.id !== ward.id), ward]
      wards.sort((a, b) => a.id.localeCompare(b.id))
      setSelectedWard(ward)
    },
    onMutate: async (ward) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousWards = queryClient.getQueryData<WardDTO[]>([queryKey])

      queryClient.setQueryData<WardDTO[]>(
        [queryKey],
        (old) => [...(old === undefined ? [] : old.filter(value => value.id !== ward.id)), ward])

      wards.sort((a, b) => a.id.localeCompare(b.id))
      return { previousWards }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousWards)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    }
  })
}

export const useCreateMutation = (setSelectedWard: (ward:(WardDTO | undefined)) => void, organizationUUID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ward) => {
      const idToken = Cookies.get(COOKIE_ID_TOKEN_KEY)
      const headers = {
        'Authorization': `Bearer ${idToken}`,
        'X-Organization': `3b25c6f5-4705-4074-9fc6-a50c28eba406`
      }

      const createWardRequest = new CreateWardRequest()
      createWardRequest.setName(ward.name)
      const res = await wardService.createWard(createWardRequest, headers)
      const newWard: WardDTO = { ...ward, ...res }

      wards = [...wards, newWard]
      wards.sort((a, b) => a.id.localeCompare(b.id))
      setSelectedWard(newWard)
    },
    onMutate: async (ward: WardDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousWards = queryClient.getQueryData<WardDTO[]>([queryKey])
      queryClient.setQueryData<WardDTO[]>([queryKey], (old) => [...(old === undefined ? [] : old), ward])
      wards.sort((a, b) => a.id.localeCompare(b.id))
      return { previousWards }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousWards)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}

export const useDeleteMutation = (setSelectedWard: (ward:(WardDTO | undefined)) => void, organizationUUID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ward) => {
      // TODO create request for ward
      wards = [...wards.filter(value => value.id !== ward.id)]
      setSelectedWard(undefined)
    },
    onMutate: async (Ward: WardDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousWards = queryClient.getQueryData<WardDTO[]>([queryKey])
      queryClient.setQueryData<WardDTO[]>(
        [queryKey],
        (old) => [...(old === undefined ? [] : old.filter(value => value.id !== Ward.id))])
      return { previousWards }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousWards)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}
