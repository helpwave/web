import clsx from 'clsx'
import { Modal, type ModalProps, type ModalHeaderProps } from '@helpwave/common/components/modals/Modal'
import type { TaskDetailViewProps } from '@/components/layout/TaskDetailView'
import { TaskDetailView } from '@/components/layout/TaskDetailView'

export type TaskDetailModalProps =
  Omit<ModalProps, keyof ModalHeaderProps>
  & TaskDetailViewProps

/**
 * A Modal Wrapper for the task detail view
 */
export const TaskDetailModal = ({
  taskId,
  wardId,
  patientId,
  onClose,
  initialStatus,
  modalClassName,
  ...modalProps
}: TaskDetailModalProps) => {
  return (
    <Modal
      modalClassName={clsx(modalClassName)}
      {...modalProps}
    >
      <TaskDetailView patientId={patientId} wardId={wardId} taskId={taskId} onClose={onClose} initialStatus={initialStatus}/>
    </Modal>
  )
}
