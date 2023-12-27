import { tx } from '@helpwave/common/twind'
import { Modal, type ModalProps, type ModalHeaderProps } from '@helpwave/common/components/modals/Modal'
import { TaskDetailView, type TaskDetailViewProps } from './layout/TaskDetailView'

export type TaskDetailModalProps =
  Omit<ModalProps, keyof ModalHeaderProps>
  & TaskDetailViewProps

/**
 * A Modal Wrapper for the task detail view
 */
export const TaskDetailModal = ({
  taskId,
  patientId,
  onClose,
  initialStatus,
  modalClassName,
  ...modalProps
}: TaskDetailModalProps) => {
  return (
    <Modal
      modalClassName={tx(modalClassName)}
      {...modalProps}
    >
      <TaskDetailView patientId={patientId} taskId={taskId} onClose={onClose} initialStatus={initialStatus}/>
    </Modal>
  )
}
