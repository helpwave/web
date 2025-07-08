import { useContext, useState } from 'react'
import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import {
  ConfirmModal,
  Input,
  type PropsForTranslation,
  SolidButton,
  Textarea,
  TextButton,
  useTranslation
} from '@helpwave/hightide'
import type { TaskTemplateDTO } from '@helpwave/api-services/types/tasks/tasks_templates'
import { SubtaskView } from '../SubtaskView'
import { ColumnTitle } from '../ColumnTitle'
import { TaskTemplateContext, type TaskTemplateFormType } from '@/pages/templates'

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
    required: 'Required Field, cannot be empty'
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

export type TaskTemplateDetailsProps = {
  onCreate: (taskTemplate: TaskTemplateDTO) => void,
  onUpdate: (taskTemplate: TaskTemplateFormType) => void,
  onDelete: (taskTemplate: TaskTemplateDTO) => void,
}

/**
 * The right side of the task templates page
 */
export const TaskTemplateDetails = ({
                                      overwriteTranslation,
                                      onCreate,
                                      onUpdate,
                                      onDelete,
                                    }: PropsForTranslation<TaskTemplateDetailsTranslation, TaskTemplateDetailsProps>) => {
  const context = useContext(TaskTemplateContext)

  const translation = useTranslation([defaultTaskTemplateDetailsTranslations], overwriteTranslation)
  const isCreatingNewTemplate = context.state.template.id === ''
  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)
  const [touched, setTouched] = useState({
    name: !isCreatingNewTemplate
  })

  const inputErrorClasses = 'border-negative focus:border-negative focus:ring-negative border-2'
  const inputClasses = 'mt-1 block rounded-md w-full border-gray-300 shadow-sm focus:outline-none focus:border-primary focus:ring-primary'

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

  const nameErrorMessage: string | undefined = validateName(context.state.template.name)
  const isDisplayingNameError: boolean = touched.name && nameErrorMessage !== undefined

  return (
    <div className="col py-4 px-6">
      <ConfirmModal
        headerProps={{
          titleText: translation('deleteConfirmText')
        }}
        isOpen={isShowingConfirmDialog}
        onCancel={() => setIsShowingConfirmDialog(false)}
        onConfirm={() => {
          setIsShowingConfirmDialog(false)
          onDelete(context.state.template)
        }}
        confirmType="negative"
      />
      <ColumnTitle
        title={isCreatingNewTemplate ? translation('createTaskTemplate') : translation('updateTaskTemplate')}
        description={!isCreatingNewTemplate ? translation('updateTaskTemplateDescription') : undefined}
      />
      <div className=" col gap-y-4 max-w-[400px] mb-4">
        <div>
          <Input
            id="name"
            value={context.state.template.name}
            label={{ name: translation('name') }}
            type="text"
            onBlur={() => setTouched({ name: true })}
            onChangeText={text => {
              context.updateContext({
                template: { ...context.state.template, name: text },
                isValid: validateName(text) === undefined,
                hasChanges: true,
                deletedSubtaskIds: context.state.deletedSubtaskIds
              })
            }}
            maxLength={maxNameLength}
            className={clsx(inputClasses, { [inputErrorClasses]: isDisplayingNameError })}
          />
          {isDisplayingNameError && <span className="textstyle-form-error">{nameErrorMessage}</span>}
        </div>
        <Textarea
          headline={translation('notes')}
          id="notes"
          value={context.state.template.notes}
          onChangeText={text => {
            context.updateContext({
              template: { ...context.state.template, notes: text },
              isValid: context.state.isValid,
              hasChanges: true,
              deletedSubtaskIds: context.state.deletedSubtaskIds
            })
          }}
        />
      </div>
      <SubtaskView
        taskTemplateId={context.state.template.id}
        subtasks={context.state.template.subtasks}
        onChange={subtasks => context.updateContext({
          hasChanges: true,
          isValid: context.state.isValid,
          template: { ...context.state.template, subtasks },
          deletedSubtaskIds: context.state.deletedSubtaskIds
        })}
      />
      <div className={clsx('row mt-12',
        {
          'justify-between': !isCreatingNewTemplate,
          'justify-end': isCreatingNewTemplate,
        })}
      >
        <SolidButton
          className="w-auto"
          onClick={() => isCreatingNewTemplate ? onCreate(context.state.template) : onUpdate(context.state)}
          disabled={!context.state.isValid}
        >
          {isCreatingNewTemplate ? translation('create') : translation('update')}
        </SolidButton>
        {!isCreatingNewTemplate &&
          (
<TextButton color="negative"
                       onClick={() => setIsShowingConfirmDialog(true)}>{translation('deleteTaskTemplate')}</TextButton>
)
        }
      </div>
    </div>
  )
}
