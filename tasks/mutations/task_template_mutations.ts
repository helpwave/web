import type { SubTaskDTO } from './room_mutations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export type TaskTemplateDTO = {
  id: string,
  name: string,
  notes: string,
  subtasks: SubTaskDTO[],
  isPublicVisible: boolean
}

const queryKey = 'taskTemplates'

// TODO remove once backend is implemented
let taskTemplates: TaskTemplateDTO[] = [
  { id: 'id1', subtasks: [{ name: 'Subtask', isDone: false }], name: 'Template 1', notes: '', isPublicVisible: false },
  { id: 'id2', subtasks: [], name: 'Template 2', notes: '', isPublicVisible: false },
  { id: 'id3', subtasks: [], name: 'Template 3', notes: '', isPublicVisible: false },
  { id: 'id4', subtasks: [], name: 'Template 4', notes: '', isPublicVisible: false },
  { id: 'id5', subtasks: [], name: 'Template 5', notes: '', isPublicVisible: false },
  { id: 'id6', subtasks: [], name: 'Template 6', notes: '', isPublicVisible: false }
]

export const useTaskTemplateQuery = () => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      // TODO fetch task templates
      return taskTemplates
    },
  })
}

export const useUpdateMutation = (setTemplate: (taskTemplate:TaskTemplateDTO | undefined) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskTemplate: TaskTemplateDTO) => {
      // TODO create request for taskTemplate
      taskTemplates = [...taskTemplates.filter(value => value.id !== taskTemplate.id), taskTemplate]
      taskTemplates.sort((a, b) => a.id.localeCompare(b.id))
      setTemplate(taskTemplate)
    },
    onMutate: async (taskTemplate: TaskTemplateDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousTaskTemplates = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey])
      queryClient.setQueryData<TaskTemplateDTO[]>(
        [queryKey],
        // TODO do optimistic update here
        (old) => old)
      taskTemplates.sort((a, b) => a.id.localeCompare(b.id))
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

export const useCreateMutation = (setTemplate: (taskTemplate:TaskTemplateDTO | undefined) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskTemplate:TaskTemplateDTO) => {
      const newTaskTemplate = { ...taskTemplate, id: Math.random().toString() }
      // TODO create request for taskTemplate
      taskTemplates = [...taskTemplates, newTaskTemplate]
      taskTemplates.sort((a, b) => a.id.localeCompare(b.id))
      setTemplate(newTaskTemplate)
    },
    onMutate: async (taskTemplate:TaskTemplateDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousTaskTemplate = queryClient.getQueryData<TaskTemplateDTO[]>([queryKey])
      // TODO do optimistic update here
      queryClient.setQueryData<TaskTemplateDTO[]>([queryKey], (old) => old)
      taskTemplates.sort((a, b) => a.id.localeCompare(b.id))
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

export const useDeleteMutation = (setTemplate: (task:TaskTemplateDTO | undefined) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskTemplate) => {
      // TODO create request for taskTemplate
      taskTemplates = taskTemplates.filter(value => value.id !== taskTemplate.id)
      taskTemplates.sort((a, b) => a.id.localeCompare(b.id))
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
