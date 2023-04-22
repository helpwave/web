import { tw } from '@helpwave/common/twind'
import { TimeDisplay } from '@helpwave/common/components/TimeDisplay'
import Link from 'next/link'

export type Feature = {
  title: string,
  date: Date,
  description: (string | URL)[],
  externResource: URL
}

export type FeatureDisplayProps = {
  feature: Feature
}

export const FeatureDisplay = ({ feature }: FeatureDisplayProps) => {
  return (
    <Link href={feature.externResource} className={tw('flex flex-row gap-x-8 hover:bg-gray-100 rounded-xl p-3')}>
      <div className={tw('flex flex-col gap-x-2 w-1/3')}>
        <TimeDisplay date={feature.date} mode="date" />
        <span className={tw('text-hw-primary-700 text-xl font-bold')}>{feature.title}</span>
      </div>
      <div className={tw('flex flex-col gap-y-2 flex-1')}>
        {feature.description.map(value => value instanceof URL ?
          <img src={value.href} alt="" className={tw('h-auto w-full rounded-xl')}/> :
          <span className={tw('font-semibold')}>{value}</span>)
        }
      </div>
    </Link>
  )
}
