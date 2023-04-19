import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import type { TaskDTO } from '../../mutations/room_mutations'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind/index'
import { ToggleableInput } from '../user_input/ToggleableInput'
import { Textarea } from '../user_input/Textarea'
import { Select } from '../user_input/Select'
import { TaskStatusSelect } from '../user_input/TaskStatusSelect'
import { Button } from '../Button'
import { SubtaskView } from '../SubtaskView'
import { X } from 'lucide-react'

type TaskDetailViewTranslation = {
  close: string,
  notes: string,
  subtasks: string,
  assignee: string,
  dueDate: string,
  status: string,
  visibility: string,
  creationTime: string,
  private: string,
  public: string,
  create: string,
  update: string
}

const defaultTaskDetailViewTranslation = {
  en: {
    close: 'Close',
    notes: 'Notes',
    subtasks: 'Subtasks',
    assignee: 'Assignee',
    dueDate: 'Due-Date',
    status: 'Status',
    visibility: 'Visibility',
    creationTime: 'Creation Time',
    private: 'private',
    public: 'public',
    create: 'Create',
    update: 'Update'
  },
  de: {
    close: 'Schließen',
    notes: 'Notizen',
    subtasks: 'Unteraufgaben',
    assignee: 'Veranwortlich',
    dueDate: 'Fälligkeits-Datum',
    status: 'Status',
    visibility: 'Sichbarkeit',
    creationTime: 'Erstell Zeit',
    private: 'privat',
    public: 'öffentlich',
    create: 'Hinzufügen',
    update: 'Ändern'
  }
}

type TaskDetailViewProps = {
  task: TaskDTO,
  onChange: (task: TaskDTO) => void,
  onClose: () => void,
  onFinishClick: () => void
}

export const TaskDetailView = ({
  language,
  task,
  onChange,
  onClose,
  onFinishClick
}: PropsWithLanguage<TaskDetailViewTranslation, TaskDetailViewProps>) => {
  const translation = useTranslation(language, defaultTaskDetailViewTranslation)
  const labelClassName = 'font-bold text-medium text-gray-600'
  return (
    <div className={tw('flex flex-col h-full p-2')}>
      <div className={tw('flex flex-row justify-between')}>
        <div className={tw('w-3/4 mr-2')}>
          <ToggleableInput
            autoFocus
            initialState="editing"
            id={task.id}
            value={task.name}
            onChange={name => onChange({ ...task, name })}
            labelClassName={tw('text-2xl font-bold')}
          />
        </div>
        <button className={tw('flex flex-row gap-x-2')} onClick={onClose}>
          <span>{translation.close}</span>
          <X />
        </button>
      </div>
      <div className={tw('flex flex-row flex-1 gap-x-8 mt-3')}>
        <div className={tw('flex flex-col gap-y-4 w-[60%] min-w-[500px]')}>
          <div className={tw('min-h-1/4')}>
            <Textarea
              headline={translation.notes}
              value={task.description}
              onChange={description => onChange({ ...task, description })}
            />
          </div>
          <SubtaskView subtasks={task.subtasks} onChange={subtasks => onChange({ ...task, subtasks })} />
        </div>
        <div className={tw('flex flex-col justify-between min-w-[250px]')}>
          <div className={tw('flex flex-col gap-y-4')}>
            <div>
              <label className={tw(labelClassName)}>{translation.assignee}</label>
              <Select
                value={task.assignee}
                options={[
                  { label: 'Assignee 1', value: 'assignee1' },
                  { label: 'Assignee 2', value: 'assignee2' },
                  { label: 'Assignee 3', value: 'assignee3' },
                  { label: 'Assignee 4', value: 'assignee4' }
                ]}
                onChange={assignee => onChange({ ...task, assignee })}
              />
            </div>
            <div>
              <label className={tw(labelClassName)}>{translation.dueDate}</label>
              {/* TODO use some date picker component */}
              <Select
                value={task.dueDate}
                options={[
                  { label: 'Finished', value: 'Finished' },
                  { label: '02.03.2001', value: '02.03.2001' },
                  { label: '17.07.2011', value: '17.07.2011' },
                  { label: '01.04.2014', value: '01.04.2014' }
                ]}
                onChange={dueDate => onChange({ ...task, dueDate })}
              />
            </div>
            <div>
              <label className={tw(labelClassName)}>{translation.status}</label>
              <TaskStatusSelect value={task.status} onChange={status => onChange({ ...task, status })}/>
            </div>
            <div>
              <label className={tw(labelClassName)}>{translation.visibility}</label>
              <Select
                value={task.isPublicVisible}
                options={[
                  { label: translation.private, value: false },
                  { label: translation.public, value: true }
                ]}
                onChange={isPublicVisible => onChange({ ...task, isPublicVisible })}
              />
            </div>
          </div>
          {task.creationDate !== undefined ? (
            <div className={tw('flex flex-col gap-y-8 mt-16')}>
              <div className={tw('flex flex-col')}>
                <span className={tw('font-bold text-gray-800 mb-1')}>{translation.creationTime}</span>
                <span>{task.creationDate.toString()}</span>
              </div>
              <Button color="accent" onClick={onFinishClick}>{translation.update}</Button>
            </div>
          ) : <Button color="accent" onClick={onFinishClick} className={tw('mt-16')}>{translation.create}</Button>}
        </div>
      </div>
    </div>
  )
}
