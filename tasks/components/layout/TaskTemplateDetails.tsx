import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import {
  ConfirmDialog,
  FormElementWrapper,
  Input,
  type PropsForTranslation,
  SolidButton,
  Textarea,
  TextButton,
  useTranslation
} from '@helpwave/hightide'
import { SubtaskView } from '../SubtaskView'
import { ColumnTitle } from '../ColumnTitle'
import { emptyTaskTemplate, TaskTemplateContext } from '@/pages/templates'
import {
  useTaskTemplateCreateMutation,
  useTaskTemplateDeleteMutation,
  useTaskTemplateSubtaskCreateMutation,
  useTaskTemplateSubtaskDeleteMutation,
  useTaskTemplateSubtaskUpdateMutation,
  useTaskTemplateUpdateMutation
} from '@helpwave/api-services/mutations/tasks/task_template_mutations'

type TaskTemplateDetailsTranslation = {
  updateTaskTemplate: string,
  updateTaskTemplateDescription: string,
  createTaskTemplate: string,
  name: string,
  notes: string,
  deleteTaskTemplate: string,
  deleteConfirmText: string,
  create: string,
  update: string,
  tooLong: string,
  tooShort: string,
  required: string,
}

const defaultTaskTemplateDetailsTranslations: Translation<TaskTemplateDetailsTranslation> = {
  en: {
    updateTaskTemplate: 'Update Task Template',
    updateTaskTemplateDescription: 'Here you can update details about the Task Template',
    createTaskTemplate: 'Create Task Template',
    name: 'Name',
    notes: 'Notes',
    deleteTaskTemplate: 'Delete Task Template',
    deleteConfirmText: 'Do you really want to delete this templates?',
    create: 'Create',
    update: 'Update',
    tooLong: `Too long, at most {{characters}} characters`,
    tooShort: `Too short, at least {{characters}} characters`,
    required: 'Required Field, cannot be empty',
  },
  de: {
    updateTaskTemplate: 'Task Template bearbeiten',
    updateTaskTemplateDescription: 'Hier kannst du deine Vorlagen bearbeiten',
    createTaskTemplate: 'Task Template erstellen',
    name: 'Name',
    notes: 'Notizen',
    deleteTaskTemplate: 'Task Template löschen',
    deleteConfirmText: 'Wollen Sie wirklich dieses Task Template löschen?',
    create: 'Erstellen',
    update: 'Ändern',
    tooLong: `Zu lang, maximal {{characters}} Zeichen`,
    tooShort: `Zu kurz, mindestens {{characters}} Zeichen`,
    required: 'Benötigter Wert, darf nicht leer sein'
  }
}

export type TaskTemplateDetailsProps = object

/**
 * The right side of the task templates page
 */
export const TaskTemplateDetails = ({
                                      overwriteTranslation,
                                    }: PropsForTranslation<TaskTemplateDetailsTranslation, TaskTemplateDetailsProps>) => {
  const { state, updateContext } = useContext(TaskTemplateContext)
  const { template, wardId } = state
  const translation = useTranslation([defaultTaskTemplateDetailsTranslations], overwriteTranslation)

  const createMutation = useTaskTemplateCreateMutation({
    onSuccess: (taskTemplate) => {
      updateContext(prevState => ({
        ...prevState,
        hasChanges: false,
        isValid: taskTemplate !== undefined,
        template: taskTemplate
      }))
    }
  })

  const updateMutation = useTaskTemplateUpdateMutation({
    onSuccess: () => {
      updateContext(prevState => ({
        ...prevState,
        hasChanges: false,
        isValid: true,
      }))
    },
  })

  const deleteMutation = useTaskTemplateDeleteMutation({
    onSuccess: () => {
      updateContext(prevState => ({
        ...prevState,
        hasChanges: false,
        isValid: true,
        template: emptyTaskTemplate
      }))
    },
  })

  const createSubtaskMutation = useTaskTemplateSubtaskCreateMutation()
  const updateSubtaskMutation = useTaskTemplateSubtaskUpdateMutation()
  const removeSubtaskMutation = useTaskTemplateSubtaskDeleteMutation()

  const isCreatingNewTemplate = !template.id
  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)
  const [touched, setTouched] = useState({
    name: !isCreatingNewTemplate
  })

  const minNameLength = 2
  const maxNameLength = 32

  function validateName(name: string) {
    const taskTemplateName = name.trim()
    if (taskTemplateName === '') {
      return translation('required')
    } else if (taskTemplateName.length < minNameLength) {
      return translation('tooShort', { replacements: { characters: minNameLength.toString() } })
    } else if (taskTemplateName.length > maxNameLength) {
      return translation('tooLong', { replacements: { characters: maxNameLength.toString() } })
    }
  }

  const nameErrorMessage: string | undefined = validateName(template.name)
  const isDisplayingNameError: boolean = touched.name && nameErrorMessage !== undefined

  useEffect(() => {
    if (isCreatingNewTemplate && template.wardId !== wardId) {
      updateContext(prevState => ({
        ...prevState,
        template: { ...template, wardId }
      }))
    }
  }, [isCreatingNewTemplate, template, updateContext, wardId])

  return (
    <div className="col py-4 px-6">
      <ConfirmDialog
        titleElement={translation('deleteConfirmText')}
        description={undefined}
        isOpen={isShowingConfirmDialog}
        onCancel={() => setIsShowingConfirmDialog(false)}
        onConfirm={() => {
          setIsShowingConfirmDialog(false)
          deleteMutation.mutate(template.id)
        }}
        confirmType="negative"
      />
      <ColumnTitle
        title={isCreatingNewTemplate ? translation('createTaskTemplate') : translation('updateTaskTemplate')}
        description={!isCreatingNewTemplate ? translation('updateTaskTemplateDescription') : undefined}
      />
      <div className=" col gap-y-4 max-w-128 mb-4">
        <FormElementWrapper
          id="name"
          label={translation('name')}
          error={isDisplayingNameError}
          isShowingError={touched.name}
        >
          {({ isShowingError: _, setIsShowingError: _2, ...bag }) => (
            <Input
              {...bag}
              value={template.name}
              onBlur={() => setTouched({ name: true })}
              onChangeText={text => {
                updateContext(prevState => ({
                  ...prevState,
                  template: { ...prevState.template, name: text },
                  isValid: validateName(text) === undefined,
                  hasChanges: true,
                  deletedSubtaskIds: state.deletedSubtaskIds
                }))
              }}
              maxLength={maxNameLength}
            />
          )}
        </FormElementWrapper>
        <FormElementWrapper
          id="notes"
          label={translation('notes')}
        >
          {({ isShowingError: _, setIsShowingError: _2, ...bag }) => (
            <Textarea
              {...bag}
              value={template.notes}
              onChangeText={text => {
                updateContext(prevState => ({
                  ...prevState,
                  template: { ...state.template, notes: text },
                  isValid: state.isValid,
                  hasChanges: true,
                  deletedSubtaskIds: state.deletedSubtaskIds
                }))
              }}
            />
          )}
        </FormElementWrapper>
      </div>
      <SubtaskView
        taskOrTemplateId={template.id}
        subtasks={template.subtasks}
        onChange={subtasks => updateContext(prevState => ({
          ...prevState,
          hasChanges: true,
          isValid: state.isValid,
          template: { ...template, subtasks },
          deletedSubtaskIds: state.deletedSubtaskIds
        }))}
        onAdd={subtask => createSubtaskMutation.mutate(subtask)}
        onUpdate={subtask => updateSubtaskMutation.mutate(subtask)}
        onRemove={subtask => removeSubtaskMutation.mutate(subtask.id)}
      />
      <div className={clsx('row mt-12',
        {
          'justify-between': !isCreatingNewTemplate,
          'justify-end': isCreatingNewTemplate,
        })}
      >
        <SolidButton
          className="w-auto"
          onClick={() => {
            if (isCreatingNewTemplate) {
              createMutation.mutate(template)
            } else {
              updateMutation.mutate(template)
            }
          }}
          disabled={!state.isValid}
        >
          {isCreatingNewTemplate ? translation('create') : translation('update')}
        </SolidButton>
        {!isCreatingNewTemplate &&
          (
            <TextButton
              color="negative"
              onClick={() => setIsShowingConfirmDialog(true)}
            >
              {translation('deleteTaskTemplate')}
            </TextButton>
          )
        }
      </div>
    </div>
  )
}
