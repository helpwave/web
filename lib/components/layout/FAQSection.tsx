import type { ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ExpandableProps } from '../Expandable'
import { Expandable } from '../Expandable'
import { MarkdownInterpreter } from '../MarkdownInterpreter'

type ContentType = {
  type: 'markdown',
  value: string,
} | {
  type: 'custom',
  value: ReactNode,
}

export type FAQItem = Pick<ExpandableProps, 'initialExpansion'| 'className'> & {
  id: string,
  title: string,
  content: ContentType,
}

export type FAQSectionProps = {
  entries: FAQItem[],
  expandableClassName?: string,
}

/**
 * Description
 */
export const FAQSection = ({
  entries,
  expandableClassName
}: FAQSectionProps) => {
  const chevronSize = 28
  return (
    <div className={clsx('col gap-y-4')}>
      {entries.map(({ id, title, content, ...restProps }) => (
        <Expandable
          key={id}
          {...restProps}
          label={(<h3 id={id} className={clsx('textstyle-title-md')}>{title}</h3>)}
          clickOnlyOnHeader={false}
          icon={(expanded) => expanded ?
              (<ChevronUp size={chevronSize} className={clsx(`text-blue-600 min-w-[${chevronSize}px]`)}/>) :
              (<ChevronDown size={chevronSize} className={clsx(`text-blue-600 min-w-[${chevronSize}px]`)}/>)
          }
          className={clsx('rounded-xl', expandableClassName)}
          headerClassName={"px-6 py-4"}
        >
          <div className={clsx('mt-2 px-6 pb-4')}>
            {content.type === 'markdown' ? (<MarkdownInterpreter text={content.value}/>) : content.value}
          </div>
        </Expandable>
      ))}
    </div>
  )
}
