import type { ReactNode } from 'react'
import { tw } from '@twind/core'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Expandable } from '../Expandable'
import { MarkdownInterpreter } from '../MarkdownInterpreter'
import { Span } from '../Span'

type ContentType = {
  type: 'markdown',
  value: string
} | {
  type: 'custom',
  value: ReactNode
}

export type FAQItem = {
  id: string,
  title: string,
  content: ContentType,
  initialExpansion?: boolean,
  className?: string
}

export type FAQSectionProps = {
  entries: FAQItem[]
}

/**
 * Description
 */
export const FAQSection = ({
  entries,
}: FAQSectionProps) => {
  const chevronSize = 28
  return (
    <div className={tw('flex flex-col gap-y-4')}>
      {entries.map(({ id, title, content, ...restProps }) => (
        <Expandable
          key={id}
          {...restProps}
          label={(<h3 id={id} className={tw('select-none')}><Span type="title">{title}</Span></h3>)}
          clickOnlyOnHeader={false}
          icon={(expanded) => expanded ?
              (<ChevronUp size={chevronSize} className={tw('text-blue-600')}/>) :
              (<ChevronDown size={chevronSize} className={tw('text-blue-600')}/>)
          }
          className={tw('bg-white rounded-xl px-4 py-2')}
        >
          <div className={tw('mt-2')}>
            {content.type === 'markdown' ? (<MarkdownInterpreter text={content.value}/>) : content.value}
          </div>
        </Expandable>
      ))}
    </div>
  )
}
