import type { SubTaskDTO } from './room_mutations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/components/user_input/Input'

export type TaskTemplateDTO = {
  id: string,
  name: string,
  notes: string,
  subtasks: SubTaskDTO[],
  isPublicVisible: boolean
}

type QueryKey = 'personalTaskTemplates'| 'wardTaskTemplates'

// TODO remove once backend is implemented
let personalTaskTemplates: TaskTemplateDTO[] = [
  { id: 'id1', subtasks: [{ name: 'Subtask', isDone: false }], name: 'Personal Template 1', notes: '', isPublicVisible: false },
  { id: 'id2', subtasks: [], name: 'Personal Template 2', notes: '', isPublicVisible: false },
  { id: 'id3', subtasks: [], name: 'Personal Template 3', notes: '', isPublicVisible: false },
  { id: 'id4', subtasks: [], name: 'Personal Template 4', notes: '', isPublicVisible: false },
  { id: 'id5', subtasks: [], name: 'Personal Template 5', notes: '', isPublicVisible: false },
  { id: 'id6', subtasks: [], name: 'Personal Template 6', notes: '', isPublicVisible: false },
  { id: 'id7', subtasks: [], name: 'Personal Template 7', notes: '', isPublicVisible: false }
]

// TODO remove once backend is implemented
let wardTaskTemplates: TaskTemplateDTO[] = [
  { id: 'id1', subtasks: [{ name: 'Subtask', isDone: false }], name: 'Ward Template 1', notes: '', isPublicVisible: false },
  { id: 'id2', subtasks: [], name: 'Ward Template 2', notes: '', isPublicVisible: false },
  { id: 'id3', subtasks: [], name: 'Ward Template 3', notes: '', isPublicVisible: false },
  { id: 'id4', subtasks: [], name: 'Ward Template 4', notes: '', isPublicVisible: false },
  { id: 'id5', subtasks: [], name: 'Ward Template 5', notes: '', isPublicVisible: false },
  { id: 'id6', subtasks: [], name: 'Ward Template 6', notes: '', isPublicVisible: false },
  { id: 'id7', subtasks: [], name: 'Ward Template 7', notes: '', isPublicVisible: false }
]

export const useTaskTemplateQuery = (queryKey: QueryKey, onSuccess: (data: TaskTemplateDTO[]) => void = noop) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      if (queryKey === 'wardTaskTemplates') {
        return wardTaskTemplates
      }
      // TODO fetch task templates
      return personalTaskTemplates
    },
    onSuccess
  })
}

export const useUpdateMutation = (queryKey: QueryKey, setTemplate: (taskTemplate:TaskTemplateDTO | undefined) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskTemplate: TaskTemplateDTO) => {
      // TODO create request for taskTemplate
      if (queryKey === 'wardTaskTemplates') {
        wardTaskTemplates = [...wardTaskTemplates.filter(value => value.id !== taskTemplate.id), taskTemplate]
        wardTaskTemplates.sort((a, b) => a.id.localeCompare(b.id))
      }
      personalTaskTemplates = [...personalTaskTemplates.filter(value => value.id !== taskTemplate.id), taskTemplate]
      personalTaskTemplates.sort((a, b) => a.id.localeCompare(b.id))
      setTemplate(taskTemplate)
    },
    onMutate: async (taskTemplate: TaskTemplateDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousTaskTemplates = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey])
      queryClient.setQueryData<TaskTemplateDTO[]>(
        [queryKey],
        // TODO do optimistic update here
        (old) => old)
      return { previousTaskTemplates }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousTaskTemplates)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    }
  })
}

export const useCreateMutation = (queryKey: QueryKey, setTemplate: (taskTemplate:TaskTemplateDTO | undefined) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskTemplate:TaskTemplateDTO) => {
      const newTaskTemplate = { ...taskTemplate, id: Math.random().toString() }
      // TODO create request for taskTemplate
      if (queryKey === 'wardTaskTemplates') {
        wardTaskTemplates = [...wardTaskTemplates, newTaskTemplate]
        wardTaskTemplates.sort((a, b) => a.id.localeCompare(b.id))
      }
      personalTaskTemplates = [...personalTaskTemplates, newTaskTemplate]
      personalTaskTemplates.sort((a, b) => a.id.localeCompare(b.id))
      setTemplate(newTaskTemplate)
    },
    onMutate: async (taskTemplate:TaskTemplateDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousTaskTemplate = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey])
      // TODO do optimistic update here
      queryClient.setQueryData<TaskTemplateDTO[]>([queryKey], (old) => old)
      return { previousTaskTemplate }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousTaskTemplate)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}

export const useDeleteMutation = (queryKey: QueryKey, setTemplate: (task:TaskTemplateDTO | undefined) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskTemplate) => {
      // TODO create request for taskTemplate
      if (queryKey === 'wardTaskTemplates') {
        wardTaskTemplates = wardTaskTemplates.filter(value => value.id !== taskTemplate.id)
        wardTaskTemplates.sort((a, b) => a.id.localeCompare(b.id))
      }
      personalTaskTemplates = personalTaskTemplates.filter(value => value.id !== taskTemplate.id)
      personalTaskTemplates.sort((a, b) => a.id.localeCompare(b.id))
      setTemplate(undefined)
    },
    onMutate: async (taskTemplate: TaskTemplateDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousTaskTemplate = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey])
      queryClient.setQueryData<TaskTemplateDTO[]>(
        [queryKey],
        // TODO do optimistic update here
        (old) => old)
      return { previousTaskTemplate }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousTaskTemplate)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}
