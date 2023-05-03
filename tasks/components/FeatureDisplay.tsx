import { tw } from '@helpwave/common/twind'
import { TimeDisplay } from '@helpwave/common/components/TimeDisplay'
import Link from 'next/link'
import { Span } from '@helpwave/common/components/Span'

export type Feature = {
  title: string,
  date: Date,
  description: (string | URL)[],
  externResource: URL
}

export type FeatureDisplayProps = {
  feature: Feature
}

/**
 * A component for showing a feature with a title, date of release and a link to a blog post on click
 */
export const FeatureDisplay = ({ feature }: FeatureDisplayProps) => {
  return (
    <Link target="_blank" href={feature.externResource} className={tw('flex flex-row gap-x-8 hover:bg-gray-100 rounded-xl p-3')}>
      <div className={tw('flex flex-col gap-x-2 w-1/3')}>
        <TimeDisplay date={feature.date} mode="date" />
        <Span type="title" className={tw('text-hw-primary-700')}>{feature.title}</Span>
      </div>
      <div className={tw('flex flex-col gap-y-2 flex-1')}>
        {feature.description.map((value, index) => value instanceof URL ?
          <img key={index} src={value.href} alt="" className={tw('h-auto w-full rounded-xl')}/> :
          <Span key={index} className={tw('font-medium')}>{value}</Span>)
        }
      </div>
    </Link>
  )
}
