import type { PropsWithChildren } from 'react'
import { tw } from '../../twind'
import { Button } from '../Button'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { Modal, type ModalProps } from './Modal'

type DiscardChangesDialogTranslation = {
  save: string,
  cancel: string,
  dontSave: string,
  title: string,
  description: string,
}

const defaultDiscardChangesDialogTranslation = {
  en: {
    save: 'Save',
    cancel: 'Cancel',
    dontSave: 'Don\'t save',
    title: 'Unsaved Changes',
    description: 'Do you want to save your changes?'
  },
  de: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    dontSave: 'Nicht Speichern',
    title: 'Ungespeicherte Änderungen',
    description: 'Möchtest du die Änderungen speichern?'
  }
}

type DiscardChangesDialogProps = ModalProps & {
  isShowingDecline?: boolean,
  requireAnswer?: boolean,
  onCancel: () => void,
  onSave: () => void,
  onDontSave: () => void,
}

export const DiscardChangesDialog = ({
  overwriteTranslation,
  children,
  title,
  description,
  onCancel,
  onSave,
  onDontSave,
  ...modalProps
}: PropsForTranslation<DiscardChangesDialogTranslation, PropsWithChildren<DiscardChangesDialogProps>>) => {
  const translation = useTranslation(defaultDiscardChangesDialogTranslation, overwriteTranslation)
  return (
    <Modal
      title={title ?? translation.title}
      description={description ?? translation.description}
      {...modalProps}
    >
      {children}
      <div className={tw('flex flex-row mt-3 gap-x-4 justify-end')}>
        <Button color="hw-positive" onClick={onSave}>
          {translation.save}
        </Button>
        <Button color="hw-negative" onClick={onDontSave}>
          {translation.dontSave}
        </Button>
        <Button autoFocus color="hw-neutral" onClick={onCancel}>
          {translation.cancel}
        </Button>
      </div>
    </Modal>
  )
}
