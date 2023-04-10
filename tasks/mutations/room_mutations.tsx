import type { Dispatch, SetStateAction } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const queryKey = 'rooms'

export type TaskDTO = {
  id: string,
  name: string,
  description: string,
  status: 'unscheduled' | 'inProgress' | 'done',
  progress: number
}

export type PatientDTO = {
  id: string,
  note: string,
  humanReadableIdentifier: string,
  tasks: TaskDTO[]
}

export type BedDTO = {
  id: string,
  name: string,
  patient?: PatientDTO
}

export type RoomDTO = {
  id: string,
  name: string,
  beds: BedDTO[]
}

// TODO remove once backend is implemented
let rooms: RoomDTO[] = [
  {
    id: 'room1',
    name: 'room name 1',
    beds: [
      {
        id: 'bed1',
        name: 'bed 1',
        patient: {
          id: 'patient1',
          note: 'Note',
          humanReadableIdentifier: 'Patient A',
          tasks: [
            {
              id: 'task1',
              name: 'Task 1',
              description: 'Description',
              status: 'unscheduled',
              progress: 0.2
            },
            {
              id: 'task2',
              name: 'Task 2',
              description: 'Description',
              status: 'unscheduled',
              progress: 0.4
            },
            {
              id: 'task3',
              name: 'Task 3',
              description: 'Description',
              status: 'unscheduled',
              progress: 0.7
            },
            {
              id: 'task4',
              name: 'Task 4',
              description: 'Description',
              status: 'inProgress',
              progress: 0.2
            },
            {
              id: 'task5',
              name: 'Task 5',
              description: 'Description',
              status: 'done',
              progress: 0.1
            },
            {
              id: 'task6',
              name: 'Task 6',
              description: 'Description',
              status: 'done',
              progress: 0.2
            }
          ]
        }
      },
      {
        id: 'bed2',
        name: 'bed 2',
        patient: {
          id: 'patient2',
          note: 'Note',
          humanReadableIdentifier: 'Patient B',
          tasks: [
            {
              id: 'task1',
              name: 'Task 1',
              description: 'Description',
              status: 'unscheduled',
              progress: 0.2
            },
            {
              id: 'task2',
              name: 'Task 2',
              description: 'Description',
              status: 'unscheduled',
              progress: 0.4
            },
            {
              id: 'task3',
              name: 'Task 3',
              description: 'Description',
              status: 'unscheduled',
              progress: 0.7
            },
            {
              id: 'task4',
              name: 'Task 4',
              description: 'Description',
              status: 'inProgress',
              progress: 0.2
            },
            {
              id: 'task5',
              name: 'Task 5',
              description: 'Description',
              status: 'done',
              progress: 0.1
            },
            {
              id: 'task6',
              name: 'Task 6',
              description: 'Description',
              status: 'done',
              progress: 0.2
            }
          ]
        }
      },
      {
        id: 'bed3',
        name: 'bed 3',
      },
      {
        id: 'bed4',
        name: 'bed 4',
      },
      {
        id: 'bed5',
        name: 'bed 5',
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

export const useUpdateMutation = (setSelectedBed: Dispatch<SetStateAction<BedDTO | undefined>>, wardUUID: string, roomUUID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bed: BedDTO) => {
      // TODO create request for bed
      const currentRoom = rooms.find(value => value.id === roomUUID)
      if (currentRoom) {
        const newBeds = [...currentRoom.beds.filter(value => value.id !== bed.id), bed]
        newBeds.sort((a, b) => a.name.localeCompare(b.name))
        const newRoom: RoomDTO = { ...currentRoom, beds: newBeds }
        rooms = [...rooms.filter(value => value.id !== roomUUID), newRoom]
        rooms.sort((a, b) => a.id.localeCompare(b.id))
        setSelectedBed(bed)
      }
    },
    onMutate: async (bed) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousRooms = queryClient.getQueryData<RoomDTO[]>([queryKey])
      queryClient.setQueryData<RoomDTO[]>(
        [queryKey],
        // TODO do optimistic update here
        (old) => old)
      rooms.sort((a, b) => a.id.localeCompare(b.id))
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

export const useCreateMutation = (setSelectedBed: Dispatch<SetStateAction<BedDTO | undefined>>, wardUUID: string, roomUUID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bed) => {
      // TODO create request for bed
      bed.id = Math.random().toString()
      const currentRoom = rooms.find(value => value.id === roomUUID)
      if (currentRoom) {
        const newBeds = [...currentRoom.beds, bed]
        newBeds.sort((a, b) => a.name.localeCompare(b.name))
        const newRoom: RoomDTO = { ...currentRoom, beds: newBeds }
        rooms = [...rooms.filter(value => value.id !== roomUUID), newRoom]
        rooms.sort((a, b) => a.id.localeCompare(b.id))
        setSelectedBed(newRoom)
      }
    },
    onMutate: async (bed: BedDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousRooms = queryClient.getQueryData<RoomDTO[]>([queryKey])
      // TODO do optimistic update here
      queryClient.setQueryData<RoomDTO[]>([queryKey], (old) => old)
      rooms.sort((a, b) => a.id.localeCompare(b.id))
      return { previousRooms }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousRooms)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}

export const useDischargeMutation = (setSelectedBed: Dispatch<SetStateAction<BedDTO | undefined>>, wardUUID: string, roomUUID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bed) => {
      // TODO create request for bed
      const currentRoom: RoomDTO| undefined = rooms.find(value => value.id === roomUUID)
      if (currentRoom) {
        const newBeds: BedDTO[] = [...currentRoom?.beds.filter(value => value.id !== bed.id), { ...bed, patient: undefined }]
        newBeds.sort((a, b) => a.name.localeCompare(b.name))
        const newRoom: RoomDTO = { ...currentRoom, beds: newBeds }
        rooms = [...rooms.filter(value => value.id !== roomUUID), newRoom]
        rooms.sort((a, b) => a.id.localeCompare(b.id))
        setSelectedBed(newRoom)
      }
    },
    onMutate: async (bed: BedDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousRooms = queryClient.getQueryData<RoomDTO[]>([queryKey])
      queryClient.setQueryData<RoomDTO[]>(
        [queryKey],
        // TODO do optimistic update here
        (old) => old)
      return { previousRooms }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousRooms)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}
