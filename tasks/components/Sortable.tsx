import { useSortable } from '@dnd-kit/sortable'
import type { PropsWithChildren } from 'react'

type SortableProps = {
  id: string
}

export const Sortable = ({ children, id }: PropsWithChildren<SortableProps>) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id,
  })

  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  )
}
