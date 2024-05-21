import type { HTMLAttributes, ReactNode } from 'react'
import { tx } from '@twind/core'

export type DividerInserterProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode[],
  divider: ReactNode
}

/**
 * A Component for inserting a divider in the middle of each child element
 *
 *  undefined elements are removed
 */
export const DividerInserter = ({
  children,
  divider,
  className,
  ...restProps
}: DividerInserterProps) => {
  const nodes: ReactNode[] = []

  for (let index = 0; index < children.length; index++) {
    const element = children[index]
    if (element !== undefined) {
      nodes.push(element)
      if (index < children.length - 1) {
        nodes.push(divider)
      }
    }
  }

  return (
    <div className={tx(className)} {...restProps}>
      {nodes}
    </div>
  )
}
