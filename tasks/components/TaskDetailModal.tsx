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
  taskID,
  patientID,
  onClose,
  modalClassName,
  ...modalProps
}: TaskDetailModalProps) => {
  return (
    <Modal
      modalClassName={tx('!p-0', { '!rounded-l-none': taskID === '' }, modalClassName)}
      {...modalProps}
    >
      <TaskDetailView patientID={patientID} taskID={taskID} onClose={onClose}/>
    </Modal>
  )
}
