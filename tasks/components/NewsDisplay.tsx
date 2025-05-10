import Link from 'next/link'
import clsx from 'clsx'
import { TimeDisplay } from '@helpwave/common/components/TimeDisplay'
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
    <div className={clsx('grow', { 'col gap-y-2': titleOnTop, 'flex-row gap-x-2': !titleOnTop })}>
      <div className={clsx('gap-x-2', {
        'col w-1/3': !titleOnTop,
        'flex-row-reverse items-center justify-between': titleOnTop
      })}>
        <div className="min-w-[100px]">
          <TimeDisplay date={news.date} mode="date"/>
        </div>
        <span className="textstyle-title-md text-primary">{news.title}</span>
      </div>
      <div className="col gap-y-2 flex-1">
        {news.description.map((value, index) => value instanceof URL ? (
            <Image
              key={index}
              src={value.href}
              alt=""
              className="h-auto w-full rounded-xl"
              width={1000}
              height={1000}
            />
        )
          :
          <span key={index} className="font-medium">{value}</span>)
        }
      </div>
    </div>
  )
  const tileStyle = 'row gap-x-8 hover:bg-gray-100 rounded-xl p-3'

  return news.externalResource !== undefined ? (
    <Link target="_blank" href={news.externalResource}
          className={clsx(tileStyle)}>
      {content}
    </Link>
  ) : <div className={clsx(tileStyle)}>{content}</div>
}
