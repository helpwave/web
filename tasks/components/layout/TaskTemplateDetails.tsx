import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useState } from 'react'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import type { TaskTemplateDTO } from '../../mutations/task_template_mutations'
import type { TaskTemplateFormType } from '../../pages/ward/templates'
import { SubtaskView } from '../SubtaskView'

type TaskTemplateDetailsTranslation = {
  updateTaskTemplate: string,
  updateTaskTemplateDescription: string,
  createTaskTemplate: string,
  name: string,
  notes: string,
  deleteTaskTemplate: string,
  deleteConfirmText: string,
  create: string,
  update: string
}

const defaultTaskTemplateDetailsTranslations: Record<Languages, TaskTemplateDetailsTranslation> = {
  en: {
    updateTaskTemplate: 'Update Task Template',
    updateTaskTemplateDescription: 'Here you can update details about the Task Template',
    createTaskTemplate: 'Create Task Template',
    name: 'Name',
    notes: 'Notes',
    deleteTaskTemplate: 'Delete Template',
    deleteConfirmText: 'Do you really want to delete this templates?',
    create: 'Create',
    update: 'Update'
  },
  de: {
    updateTaskTemplate: 'Task Vorlage bearbeiten',
    updateTaskTemplateDescription: 'Hier kannst du deine Task Vorlage bearbeiten',
    createTaskTemplate: 'Task Vorlage erstellen',
    name: 'Name',
    notes: 'Notizen',
    deleteTaskTemplate: 'Vorlage löschen',
    deleteConfirmText: 'Wollen Sie wirklich diese Vorlage löschen?',
    create: 'Erstellen',
    update: 'Ändern'
  }
}

export type TaskTemplateDetailsProps = {
  taskTemplateForm: TaskTemplateFormType,
  onCreate: (taskTemplate: TaskTemplateDTO) => void,
  onUpdate: (taskTemplate: TaskTemplateDTO) => void,
  onDelete: (taskTemplate: TaskTemplateDTO) => void,
  setTaskTemplateForm: (taskTemplateForm: TaskTemplateFormType) => void
}

/**
 * The left side of the organizations page
 */
export const TaskTemplateDetails = ({
  language,
  taskTemplateForm,
  onCreate,
  onUpdate,
  onDelete,
  setTaskTemplateForm
}: PropsWithLanguage<TaskTemplateDetailsTranslation, TaskTemplateDetailsProps>) => {
  const translation = useTranslation(language, defaultTaskTemplateDetailsTranslations)
  const isCreatingNewTemplate = taskTemplateForm.template.id === ''
  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)

  return (
    <div className={tw('flex flex-col py-4 px-6 w-5/6')}>
      <ConfirmDialog
        title={translation.deleteConfirmText}
        description={translation.deleteConfirmText}
        isOpen={isShowingConfirmDialog}
        onCancel={() => setIsShowingConfirmDialog(false)}
        onBackgroundClick={() => setIsShowingConfirmDialog(false)}
        onConfirm={() => {
          setIsShowingConfirmDialog(false)
          onDelete(taskTemplateForm.template)
        }}
        confirmType="negative"
      />
      <ColumnTitle title={isCreatingNewTemplate ? translation.createTaskTemplate : translation.updateTaskTemplate}/>

      <SubtaskView
        subtasks={taskTemplateForm.template.subtasks}
        onChange={subtasks => setTaskTemplateForm({
          hasChanges: true,
          isValid: taskTemplateForm.isValid,
          template: { ...taskTemplateForm.template, subtasks }
        })}
      />
      <div className={tx('flex flex-row mt-6',
        {
          'justify-between': !isCreatingNewTemplate,
          'justify-end': isCreatingNewTemplate,
        })}
      >
        <Button
          className={tw('w-auto')}
          onClick={() => isCreatingNewTemplate ? onCreate(taskTemplateForm.template) : onUpdate(taskTemplateForm.template)}
          disabled={!taskTemplateForm.isValid}
        >
          {isCreatingNewTemplate ? translation.create : translation.update}
        </Button>
        {
          <Button>{translation.deleteTaskTemplate}</Button>
        }
      </div>
    </div>
  )
}
