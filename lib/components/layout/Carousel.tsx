import type { ReactNode } from 'react'
import { tw, tx } from '@twind/core'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createLoopingList } from '../../util/array'

type CarouselProps = {
  children: ReactNode[],
  isLooping?: boolean,
  hintNext?: boolean,
  arrows?: boolean,
  className?: string
}

export const Carousel = ({
  children,
  // isLooping = false,
  hintNext = false,
  arrows = true,
  className = ''
}: CarouselProps) => {
  const [index, setIndex] = useState(0)

  const shownItems: ReactNode[] = createLoopingList(children, index, 3)

  return (
    <div className={tx('relative w-full', className)}>
      {arrows && (
        <>
          <div
            className={tw('absolute left-0 top-1/2 -translate-y-1/2 bg-gray-100 rounded-lg')}
            onClick={() => setIndex(Math.max(index - 1, 0))}
          >
            <ChevronLeft/>
          </div>
          <div
            className={tw('absolute right-0 top-1/2 -translate-y-1/2 bg-gray-100 rounded-lg')}
            onClick={() => setIndex((index + 1) % children.length)}
          >
            <ChevronRight/>
          </div>
        </>
      )}
      <div className={tw('px-16')}>
        {hintNext ? (
          shownItems.map((value, index) => (
            <div key={index}>
              {value}
            </div>
          ))
        ) : (
          children[index]
        )}
      </div>
    </div>
  )
}
