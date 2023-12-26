import { useContext, useState } from 'react'
import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { Button } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Input } from '@helpwave/common/components/user-input/Input'
import { Span } from '@helpwave/common/components/Span'
import { Textarea } from '@helpwave/common/components/user-input/Textarea'
import { SubtaskView } from '../SubtaskView'
import { ColumnTitle } from '../ColumnTitle'
import type { TaskTemplateDTO } from '@/mutations/task_template_mutations'
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
  tooLong: (maxCharacters: number) => string,
  tooShort: (minCharacters: number) => string,
  required: string
}

const defaultTaskTemplateDetailsTranslations: Record<Languages, TaskTemplateDetailsTranslation> = {
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
    tooLong: (maxCharacters) => `Too long, at most ${maxCharacters} characters`,
    tooShort: (minCharacters) => `Too short, at least ${minCharacters} characters`,
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
    tooLong: (maxCharacters) => `Zu lang, maximal ${maxCharacters} Zeichen`,
    tooShort: (minCharacters) => `Zu kurz, mindestens ${minCharacters} Zeichen`,
    required: 'Benötigter Wert, darf nicht leer sein'
  }
}

export type TaskTemplateDetailsProps = {
  onCreate: (taskTemplate: TaskTemplateDTO) => void,
  onUpdate: (taskTemplate: TaskTemplateFormType) => void,
  onDelete: (taskTemplate: TaskTemplateDTO) => void,
  width?: number
}

/**
 * The right side of the task templates page
 */
export const TaskTemplateDetails = ({
  language,
  onCreate,
  onUpdate,
  onDelete,
}: PropsWithLanguage<TaskTemplateDetailsTranslation, TaskTemplateDetailsProps>) => {
  const context = useContext(TaskTemplateContext)

  const translation = useTranslation(language, defaultTaskTemplateDetailsTranslations)
  const isCreatingNewTemplate = context.state.template.id === ''
  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)
  const [touched, setTouched] = useState({
    name: !isCreatingNewTemplate
  })

  const inputErrorClasses = tw('border-hw-negative-500 focus:border-hw-negative-500 focus:ring-hw-negative-500 border-2')
  const inputClasses = tw('mt-1 block rounded-md w-full border-gray-300 shadow-sm focus:outline-none focus:border-hw-primary-500 focus:ring-hw-primary-500')

  const minNameLength = 2
  const maxNameLength = 32

  function validateName(name: string) {
    const taskTemplateName = name.trim()
    if (taskTemplateName === '') {
      return translation.required
    } else if (taskTemplateName.length < minNameLength) {
      return translation.tooShort(minNameLength)
    } else if (taskTemplateName.length > maxNameLength) {
      return translation.tooLong(maxNameLength)
    }
  }

  const nameErrorMessage: string | undefined = validateName(context.state.template.name)
  const isDisplayingNameError: boolean = touched.name && nameErrorMessage !== undefined

  return (
    <div className={tw('flex flex-col py-4 px-6')}>
      <ConfirmDialog
        id="TaskTemplateDetails-DeleteDialog"
        titleText={translation.deleteConfirmText}
        isOpen={isShowingConfirmDialog}
        onCancel={() => setIsShowingConfirmDialog(false)}
        onBackgroundClick={() => setIsShowingConfirmDialog(false)}
        onCloseClick={() => setIsShowingConfirmDialog(false)}
        onConfirm={() => {
          setIsShowingConfirmDialog(false)
          onDelete(context.state.template)
        }}
        confirmType="negative"
      />
      <ColumnTitle
        title={isCreatingNewTemplate ? translation.createTaskTemplate : translation.updateTaskTemplate}
        subtitle={!isCreatingNewTemplate ? translation.updateTaskTemplateDescription : undefined}
      />
      <div className={tw(' flex flex-col gap-y-4 max-w-[400px] mb-4')}>
        <div>
          <Input
            id="name"
            value={context.state.template.name}
            label={translation.name}
            type="text"
            onBlur={() => setTouched({ name: true })}
            onChange={text => {
              context.updateContext({
                template: { ...context.state.template, name: text },
                isValid: validateName(text) === undefined,
                hasChanges: true,
                deletedSubtaskIds: context.state.deletedSubtaskIds
              })
            }}
            maxLength={maxNameLength}
            className={tx(inputClasses, { [inputErrorClasses]: isDisplayingNameError })}
          />
          {isDisplayingNameError && <Span type="formError">{nameErrorMessage}</Span>}
        </div>
        <Textarea
          headline={translation.notes}
          id="notes"
          value={context.state.template.notes}
          onChange={text => {
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
      <div className={tx('flex flex-row mt-12',
        {
          'justify-between': !isCreatingNewTemplate,
          'justify-end': isCreatingNewTemplate,
        })}
      >
        <Button
          className={tw('w-auto')}
          onClick={() => isCreatingNewTemplate ? onCreate(context.state.template) : onUpdate(context.state)}
          disabled={!context.state.isValid}
        >
          {isCreatingNewTemplate ? translation.create : translation.update}
        </Button>
        { !isCreatingNewTemplate &&
          (<Button variant="textButton" color="negative" onClick={() => setIsShowingConfirmDialog(true)}>{translation.deleteTaskTemplate}</Button>)
        }
      </div>
    </div>
  )
}
