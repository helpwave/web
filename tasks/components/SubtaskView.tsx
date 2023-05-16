import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import type { SubTaskDTO } from '../mutations/room_mutations'
import SimpleBarReact from 'simplebar-react'
import { Plus } from 'lucide-react'
import { Button } from '@helpwave/common/components/Button'
import { SubtaskTile } from './SubtaskTile'
import { Span } from '@helpwave/common/components/Span'
import { useEffect, useRef, useState } from 'react'
import type SimpleBarCore from 'simplebar-core'

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
  subtasks: SubTaskDTO[],
  onChange: (subtasks: SubTaskDTO[]) => void
}

/**
 * A view for editing and showing all subtasks of a task
 */
export const SubtaskView = ({
  language,
  subtasks,
  onChange
}: PropsWithLanguage<SubtaskViewTranslation, SubtaskViewProps>) => {
  const translation = useTranslation(language, defaultSubtaskViewTranslation)
  const scrollableRef = useRef<SimpleBarCore>(null)
  const [scrollToBottomFlag, setScrollToBottom] = useState(false)

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
                onChange={newSubtask => {
                  const newSubtasks = [...subtasks]
                  newSubtasks[index] = newSubtask
                  onChange(newSubtasks)
                }}
                onRemoveClick={() => onChange(subtasks.filter((_, subtaskIndex) => subtaskIndex !== index))}
              />
            ))}
          </div>
        </SimpleBarReact>
      </div>
      <Button
        onClick={() => {
          onChange([...subtasks, { name: translation.newSubtask, isDone: false }])
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
