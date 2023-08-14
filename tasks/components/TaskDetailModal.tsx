import { tx } from '@helpwave/common/twind'
import type { ModalProps } from '@helpwave/common/components/modals/Modal'
import type { TaskDetailViewProps } from './layout/TaskDetailView'
import { Modal } from '@helpwave/common/components/modals/Modal'
import { TaskDetailView } from './layout/TaskDetailView'

export type TaskDetailModalProps = ModalProps & TaskDetailViewProps

/**
 * A Modal Wrapper for the task detail view
 */
export const TaskDetailModal = ({
  taskId,
  patientId,
  onClose,
  modalClassName,
  ...modalProps
}: TaskDetailModalProps) => {
  return (
    <Modal
      modalClassName={tx(modalClassName)}
      {...modalProps}
    >
      <TaskDetailView patientId={patientId} taskId={taskId} onClose={onClose}/>
    </Modal>
  )
}
