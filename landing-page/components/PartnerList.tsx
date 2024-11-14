import { tw } from '@twind/core'
import Image from 'next/image'
import { Span } from '@helpwave/common/components/Span'
import { Carousel } from '@helpwave/common/components/layout/Carousel'

export type Partner = {
  name: string,
  url: string
}

export type PartnerListProps = {
  title: string,
  partners: Partner[]
}

/**
 * A List for showing different partners
 */
export const PartnerList = ({
  title,
  partners
}: PartnerListProps) => {
  return (
    <div className={tw('flex flex-col gap-y-4 items-center w-full')}>
      <Span type="title" className={tw('!text-2xl')}>{title}</Span>
      <Carousel
        hintNext={true} isLooping={true} isAutoLooping={true}
        heights={{
          tablet: 100,
          mobile: 100,
          desktop: 100
        }} itemWidths={{
          desktop: '20%',
          tablet: '33%',
          mobile: '50%'
        }}
        blurColor="transparent"
        autoLoopingTimeOut={1000}
        autoLoopAnimationTime={5000}
      >
        {partners.map(partner => (
          <div key={partner.name} className={tw('flex flex-col h-full items-center justify-center')}>
            <Image
              key={partner.name}
              width={0}
              height={0}
              src={partner.url}
              alt={partner.name}
              className={tw('w-auto max-h-[100px] py-2 px-4')}
            />
          </div>
        ))}
      </Carousel>
    </div>
  )
}
