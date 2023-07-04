import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateRoomRequest,
  UpdateRoomRequest,
  GetRoomOverviewsByWardRequest, DeleteRoomRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/room_svc_pb'
import { getAuthenticatedGrpcMetadata, roomService } from '../utils/grpc'
import type { BedDTO, BedWithPatientWithTasksNumberDTO } from './bed_mutations'

const queryKey = 'rooms'

export type RoomMinimalDTO = {
  id: string,
  name: string
}

export type RoomDTO = {
  id: string,
  name: string,
  beds: BedDTO[]
}

export type RoomOverviewDTO = {
  id: string,
  name: string,
  beds: BedWithPatientWithTasksNumberDTO[]
}

// TODO remove once backend is implemented
const rooms: RoomDTO[] = [
  {
    id: 'room1',
    name: 'room name 1',
    beds: [
      {
        id: 'bed1',
        index: 1,
        patient: {
          id: 'patient1',
          note: 'Note',
          humanReadableIdentifier: 'Patient A',
          tasks: [
            {
              id: 'task1',
              name: 'Task 1',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'unscheduled',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: false }],
              dueDate: new Date('2023-05-20'),
              isPublicVisible: false
            },
            {
              id: 'task2',
              name: 'Task 2',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'unscheduled',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: true }],
              dueDate: new Date('2023-05-01'),
              isPublicVisible: true
            },
            {
              id: 'task3',
              name: 'Task 3',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'unscheduled',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: false }],
              dueDate: new Date('2023-05-20'),
              isPublicVisible: true
            },
            {
              id: 'task4',
              name: 'Task 4',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'inProgress',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: false }],
              dueDate: new Date('2023-05-01'),
              isPublicVisible: true
            },
            {
              id: 'task5',
              name: 'Task 5',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'done',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: false }],
              dueDate: new Date('2023-05-20'),
              isPublicVisible: true
            },
            {
              id: 'task6',
              name: 'Task 6',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'done',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: false }],
              dueDate: new Date('2023-05-01'),
              isPublicVisible: true
            }
          ]
        }
      },
      {
        id: 'bed2',
        index: 2,
        patient: {
          id: 'patient2',
          note: 'Note',
          humanReadableIdentifier: 'Patient B',
          tasks: [
            {
              id: 'task1',
              name: 'Task 1',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'unscheduled',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: true }],
              dueDate: new Date('2023-05-20'),
              isPublicVisible: true
            },
            {
              id: 'task2',
              name: 'Task 2',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'unscheduled',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: false }],
              dueDate: new Date('2023-05-01'),
              isPublicVisible: true
            },
            {
              id: 'task3',
              name: 'Task 3',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'unscheduled',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: false }],
              dueDate: new Date('2023-05-20'),
              isPublicVisible: true
            },
            {
              id: 'task4',
              name: 'Task 4',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'inProgress',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: false }],
              dueDate: new Date('2023-05-20'),
              isPublicVisible: true
            },
            {
              id: 'task5',
              name: 'Task 5',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'done',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: false }],
              dueDate: new Date('2023-05-01'),
              isPublicVisible: true
            },
            {
              id: 'task6',
              name: 'Task 6',
              assignee: 'Assignee 1',
              notes: 'Notes',
              status: 'done',
              creationDate: new Date(),
              subtasks: [{ name: 'Subtask 1', isDone: false }],
              dueDate: new Date('2023-05-01'),
              isPublicVisible: true
            }
          ]
        }
      },
      {
        id: 'bed3',
        index: 3,
      },
      {
        id: 'bed4',
        index: 4,
      },
      {
        id: 'bed5',
        index: 5,
      }
    ]
  }
]

export const useRoomQuery = () => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      // TODO fetch user rooms
      return rooms
    },
  })
}

export const useRoomOverviewsQuery = (wardUUID: string) => {
  return useQuery({
    queryKey: [queryKey, 'roomOverview'],
    enabled: !!wardUUID,
    queryFn: async () => {
      const req = new GetRoomOverviewsByWardRequest()
      req.setId(wardUUID)
      const res = await roomService.getRoomOverviewsByWard(req, getAuthenticatedGrpcMetadata())

      console.log(res)
      const rooms: RoomOverviewDTO[] = res.getRoomsList().map((room) => ({
        id: room.getId(),
        name: room.getName(),
        beds: room.getBedsList().map(bed => {
          const patient = bed.getPatient()
          return {
            id: bed.getId(),
            index: 0, // TODO replace later
            patient: !patient ? undefined : {
              id: patient.getId(),
              name: patient.getId().substring(0, 6), // TODO replace with name later
              tasksUnscheduled: patient.getTasksUnscheduled(),
              tasksInProgress: patient.getTasksInProgress(),
              tasksDone: patient.getTasksDone()
            }
          }
        })
      }))

      return rooms
    },
  })
}

export const useRoomUpdateMutation = (callback: (room: RoomMinimalDTO) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (room: RoomMinimalDTO) => {
      const req = new UpdateRoomRequest()
      req.setId(room.id)
      req.setName(room.name)
      await roomService.updateRoom(req, getAuthenticatedGrpcMetadata())

      // TODO some check whether request was successful
      callback(room)
      return room
    },
    onMutate: async (room: RoomMinimalDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousRooms = queryClient.getQueryData<RoomDTO[]>([queryKey])
      queryClient.setQueryData<RoomDTO[]>(
        [queryKey],
        // TODO do optimistic update here
        (old) => old?.map(value => value.id === room.id ? { ...value, name: room.name } : value))
      return { previousRooms }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousRooms)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    }
  })
}

export const useRoomCreateMutation = (callback: (room: RoomMinimalDTO) => void, wardUUID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (room: RoomMinimalDTO) => {
      const req = new CreateRoomRequest()
      req.setWardId(wardUUID)
      req.setName(room.name)
      const res = await roomService.createRoom(req, getAuthenticatedGrpcMetadata())

      if (!res.getId()) {
        // TODO some check whether request was successful
        console.error('create room failed')
      }

      callback(room)
      return room
    },
    onMutate: async (room: RoomMinimalDTO) => {
      /*
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousRooms = queryClient.getQueryData<RoomDTO[]>([queryKey])
      const preliminaryID = Math.random().toString()
      room.id = preliminaryID

      queryClient.setQueryData<RoomDTO[]>([queryKey], (old) => {
        if (!old) {
          return old
        }
        const updated = [{ ...room, id: preliminaryID, beds: [] }, ...old]
        updated.sort((a, b) => a.name.localeCompare(b.name))
        return updated
      })
      return { previousRooms }
      */
      return {}
    },
    onError: (_, newTodo, context) => {
      // TODO at later
      // queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousRooms)
    },
    onSuccess: (data, variables, context) => {
      // TODO at later
      // queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousRooms)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}

export const useRoomDeleteMutation = (callback: () => void) => {
  return useMutation({
    mutationFn: async (roomUUID: string) => {
      const req = new DeleteRoomRequest()
      req.setId(roomUUID)
      await roomService.deleteRoom(req, getAuthenticatedGrpcMetadata())

      // TODO some check whether request was successful

      callback()
      return req.toObject()
    }
  })
}
