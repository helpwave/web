import { tw, tx } from '@helpwave/common/twind'
import { TimeDisplay } from '@helpwave/common/components/TimeDisplay'
import Link from 'next/link'
import { Span } from '@helpwave/common/components/Span'
import { z } from 'zod'

export const featureSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  image: z.string().url().optional(),
  externalResource: z.string().url().optional(),
}).transform<Feature>((obj) => {
  let description: (string | URL)[] = [obj.description]
  if (obj.image) description = [new URL(obj.image), ...description]

  return {
    title: obj.title,
    date: new Date(obj.date),
    description,
    externalResource: obj.externalResource ? new URL(obj.externalResource) : undefined
  }
})

export const featuresSchema = z.array(featureSchema)

export type Feature = {
  title: string,
  date: Date,
  description: (string | URL)[],
  externalResource?: URL
}

export type FeatureDisplayProps = {
  feature: Feature,
  titleOnTop?: boolean
}

/**
 * A component for showing a feature with a title, date of release and a link to a blog post on click
 */
export const FeatureDisplay = ({ feature, titleOnTop = true }: FeatureDisplayProps) => {
  const content = (
    <div className={tx('flex', { 'flex-col': titleOnTop, 'flex-row': !titleOnTop })}>
      <div className={tx('flex gap-x-2', {
        'flex-col w-1/3': !titleOnTop,
        'flex-row-reverse items-center justify-between mb-2': titleOnTop
      })}>
        <TimeDisplay date={feature.date} mode="date"/>
        <Span type="title" className={tw('text-hw-primary-700')}>{feature.title}</Span>
      </div>
      <div className={tw('flex flex-col gap-y-2 flex-1')}>
        {feature.description.map((value, index) => value instanceof URL ?
          <img key={index} src={value.href} alt="" className={tw('h-auto w-full rounded-xl')}/> :
          <Span key={index} className={tw('font-medium')}>{value}</Span>)
        }
      </div>
    </div>
  )
  const tileStyle = 'flex flex-row gap-x-8 hover:bg-gray-100 rounded-xl p-3'

  return feature.externalResource !== undefined ? (
    <Link target="_blank" href={feature.externalResource}
          className={tw(tileStyle)}>
      {content}
    </Link>
  ) : <div className={tw(tileStyle)}>{content}</div>
}
