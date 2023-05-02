import type { Dispatch, SetStateAction } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useWardQuery = () => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      // TODO fetch user wards
      return wards
    },
  })
}

export const useUpdateMutation = (setSelectedWard: Dispatch<SetStateAction<WardDTO | undefined>>, organizationUUID: string) => {
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

export const useCreateMutation = (setSelectedWard: Dispatch<SetStateAction<WardDTO | undefined>>, organizationUUID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ward) => {
      // TODO create request for Ward
      const newWard = { ...ward, id: Math.random().toString() }
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

export const useDeleteMutation = (setSelectedWard: Dispatch<SetStateAction<WardDTO | undefined>>, organizationUUID: string) => {
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
