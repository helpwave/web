import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import type { TaskDTO } from '../../mutations/room_mutations'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind/index'
import { ToggleableInput } from '../user_input/ToggleableInput'
import Close from '@helpwave/common/icons/Close'
import { Textarea } from '../user_input/Textarea'
import { Select } from '../user_input/Select'
import { TaskStatusSelect } from '../user_input/TaskStatusSelect'

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
  public: string
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
    public: 'public'
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
    public: 'öffentlich'
  }
}

type TaskDetailViewProps = {
  task: TaskDTO,
  onChange: (task: TaskDTO) => void
}

export const TaskDetailView = ({
  language,
  task,
  onChange
}: PropsWithLanguage<TaskDetailViewTranslation, TaskDetailViewProps>) => {
  const translation = useTranslation(language, defaultTaskDetailViewTranslation)
  return (
    <div className={tw('flex flex-col h-full')}>
      <div className={tw('flex flex-row justify-between items-center')}>
        <ToggleableInput id={task.id} value={task.name} onChange={name => onChange({ ...task, name })}/>
        <div className={tw('flex flex-row')}>
          <Close/>
          <span className={tw('ml-2 hover:text-negative-500')}>{translation.close}</span>
        </div>
      </div>
      <div className={tw('flex flex-row flex-1 gap-x-8 mt-3')}>
        <div className={tw('flex flex-col gap-y-8 w-2/3')}>
          <div className={tw('h-1/4')}>
            <Textarea
              headline={translation.notes}
              value={task.description}
              onChange={description => onChange({ ...task, description })}
            />
          </div>
          <div className={tw('flex-1 bg-red-200')}>
            Subtasks
          </div>
        </div>
        <div className={tw('flex flex-col justify-between')}>
          <div className={tw('flex flex-col gap-y-4')}>
            <div>
              <label>{translation.assignee}</label>
              <Select
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
              <label>{translation.dueDate}</label>
              {/* TODO use some date picker component */}
              <Select
                options={[
                  { label: 'Finished', value: 'Finished' },
                  { label: '02.03.2001', value: '02.03.2001' },
                  { label: '17.07.2011', value: '17.07.2011' },
                  { label: '01.04.2014', value: '01.04.2014' }
                ]}
                onChange={assignee => {
                  // TODO actually change the due date of the task
                }}
              />
              <div>
                <label>{translation.status}</label>
                <TaskStatusSelect value={task.status} onChange={status => onChange({ ...task, status })}/>
              </div>
              <div>
                <label>{translation.visibility}</label>
                <Select
                  options={[
                    { label: translation.private, value: false },
                    { label: translation.public, value: true }
                  ]}
                  onChange={taskVisibility => {
                    // TODO actually change the visibility of the task
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <span className={tw('font-bold text-gray-800')}>{translation.creationTime}</span>
            <span>{'13:00 - today' /* TODO show task creation date here */}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
