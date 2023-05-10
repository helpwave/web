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
  isOpen,
  onBackgroundClick,
  task,
  onChange,
  onClose,
  onFinishClick
}: TaskDetailModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onBackgroundClick={onBackgroundClick}
      modalClassName={tx('!p-0', { 'rounded-l-none': task.id === '' })}
    >
      <TaskDetailView task={task} onChange={onChange} onClose={onClose} onFinishClick={onFinishClick}/>
    </Modal>
  )
}
