import { tx } from '@helpwave/common/twind'
import { Modal, type ModalHeaderProps, type ModalProps } from '@helpwave/common/components/modals/Modal'
import type { TaskDetailViewProps } from '@/components/layout/taskDetailView/TaskDetailView'
import { TaskDetailView } from '@/components/layout/taskDetailView/TaskDetailView'

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
      modalClassName={tx(modalClassName)}
      {...modalProps}
    >
      <TaskDetailView
        patientId={patientId}
        wardId={wardId}
        taskId={taskId}
        onClose={onClose}
        initialStatus={initialStatus}
      />
    </Modal>
  )
}
