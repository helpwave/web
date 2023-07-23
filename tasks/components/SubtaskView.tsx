import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import SimpleBarReact from 'simplebar-react'
import { Plus } from 'lucide-react'
import { Button } from '@helpwave/common/components/Button'
import { SubtaskTile } from './SubtaskTile'
import { Span } from '@helpwave/common/components/Span'
import { useContext, useEffect, useRef, useState } from 'react'
import type SimpleBarCore from 'simplebar-core'
import type { SubTaskDTO } from '../mutations/task_mutations'
import {
  useSubTaskTemplateAddMutation
} from '../mutations/task_template_mutations'
import { TaskTemplateContext } from '../pages/templates'

type SubtaskViewTranslation = {
  subtasks: string,
  remove: string,
  addSubtask: string,
  newSubtask: string
}

const defaultSubtaskViewTranslation = {
  en: {
    subtasks: 'Subtasks',
    remove: 'Remove',
    addSubtask: 'Add Subtask',
    newSubtask: 'New Subtask'
  },
  de: {
    subtasks: 'Unteraufgaben',
    remove: 'Entfernen',
    addSubtask: 'Neue Unteraufgabe',
    newSubtask: 'Neue Unteraufgabe'
  }
}

type SubtaskViewProps = {
  // TODO: This component should not decide between two mutate functions. Pass mutate function instead.
  subtasks: SubTaskDTO[],
  taskID?: string,
  createdBy?: string,
  taskTemplateId? : string,
  onChange: (subtasks: SubTaskDTO[]) => void
}

/**
 * A view for editing and showing all subtasks of a task
 */
export const SubtaskView = ({
  language,
  subtasks,
  taskID,
  taskTemplateId,
  onChange,
}: PropsWithLanguage<SubtaskViewTranslation, SubtaskViewProps>) => {
  const context = useContext(TaskTemplateContext)

  const translation = useTranslation(language, defaultSubtaskViewTranslation)
  const scrollableRef = useRef<SimpleBarCore>(null)
  const [scrollToBottomFlag, setScrollToBottom] = useState(false)

  // TODO: Remove ?? '' once the mutate functions are passed properly
  useSubTaskTemplateAddMutation(() => undefined, taskTemplateId ?? '')
  // Automatic scrolling to the last element to give the user a visual feedback
  useEffect(() => {
    const scrollableElement = scrollableRef.current?.getScrollElement()
    if (scrollableElement && scrollToBottomFlag) {
      scrollableElement.scrollTop = scrollableElement.scrollHeight
    }
    setScrollToBottom(false)
  }, [scrollToBottomFlag, subtasks])

  return (
    <div className={tw('flex flex-col')}>
      <Span type="subsectionTitle" className={tw('mb-1')}>{translation.subtasks}</Span>
      <div className={tw('max-h-[500px] overflow-hidden mr-4')}>
        <SimpleBarReact className="h-screen" ref={scrollableRef} style={{ maxHeight: 250 }}>
          <div className={tw('grid grid-cols-1 gap-y-2')}>
            {subtasks.map((subtask, index) => (
              <SubtaskTile
                key={index}
                subtask={subtask}
                onNameChange={newSubtask => {
                  const newSubtasks = [...subtasks]
                  newSubtasks[index] = newSubtask
                  onChange(newSubtasks)
                }}
                onRemoveClick={() => {
                  const filteredSubtasks = subtasks.filter((_, subtaskIndex) => subtaskIndex !== index)
                  if (!taskID) {
                    context.updateContext({
                      ...context.state,
                      template: { ...context.state.template, subtasks: filteredSubtasks },
                      deletedSubtaskIds: [...context.state.deletedSubtaskIds ?? [], subtasks[index].id]
                    })
                  } else {
                    onChange(filteredSubtasks)
                  }
                }}
                onDoneChange={done => {
                  subtask.isDone = done
                }}
              />
            ))}
          </div>
        </SimpleBarReact>
      </div>
      <Button
        onClick={() => {
          const newSubtask = { id: '', name: translation.newSubtask, isDone: false }
          onChange([...subtasks, newSubtask])
          setScrollToBottom(true)
        }}
        className={tw('flex flex-row items-center gap-x-2 mt-4 max-w-[200px] justify-center')}
      >
        <Plus/>
        {translation.addSubtask}
      </Button>
    </div>
  )
}
