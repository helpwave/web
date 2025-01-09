import Link from 'next/link'
import { tw, tx } from '@helpwave/common/twind'
import { TimeDisplay } from '@helpwave/common/components/TimeDisplay'
import { Span } from '@helpwave/common/components/Span'
import type { News } from '@helpwave/common/util/news'
import Image from 'next/image'

export type NewsDisplayProps = {
  news: News,
  titleOnTop?: boolean,
}

/**
 * A component for showing a feature with a title, date of release and a link to a blog post on click
 */
export const NewsDisplay = ({ news, titleOnTop = true }: NewsDisplayProps) => {
  const content = (
    <div className={tx('flex grow', { 'flex-col gap-y-2': titleOnTop, 'flex-row gap-x-2': !titleOnTop })}>
      <div className={tx('flex gap-x-2', {
        'flex-col w-1/3': !titleOnTop,
        'flex-row-reverse items-center justify-between': titleOnTop
      })}>
        <div className={tw('min-w-[100px]')}>
          <TimeDisplay date={news.date} mode="date"/>
        </div>
        <Span type="title" className={tw('text-hw-primary-700')}>{news.title}</Span>
      </div>
      <div className={tw('flex flex-col gap-y-2 flex-1')}>
        {news.description.map((value, index) => value instanceof URL ? (
            <Image
              key={index}
              src={value.href}
              alt=""
              className={tw('h-auto w-full rounded-xl')}
              width={1000}
              height={1000}
            />
        )
          :
          <Span key={index} className={tw('font-medium')}>{value}</Span>)
        }
      </div>
    </div>
  )
  const tileStyle = 'flex flex-row gap-x-8 hover:bg-gray-100 rounded-xl p-3'

  return news.externalResource !== undefined ? (
    <Link target="_blank" href={news.externalResource}
          className={tw(tileStyle)}>
      {content}
    </Link>
  ) : <div className={tw(tileStyle)}>{content}</div>
}
