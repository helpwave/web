import type { HTMLAttributes, ReactNode } from 'react'
import { tx } from '@helpwave/style-themes/twind'

export type DividerInserterProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode[],
  divider: (index: number) => ReactNode,
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
        nodes.push(divider(index))
      }
    }
  }

  return (
    <div className={tx(className)} {...restProps}>
      {nodes}
    </div>
  )
}
