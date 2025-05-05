import {clsx} from 'clsx'
import Image from 'next/image'
import { Carousel } from '@helpwave/common/components/layout/Carousel'

export type Partner = {
  name: string,
  url: string,
}

export type PartnerListProps = {
  title: string,
  partners: Partner[],
}

/**
 * A List for showing different partners
 */
export const PartnerList = ({
  title,
  partners
}: PartnerListProps) => {
  return (
    <div className={clsx('col gap-y-4 items-center w-full')}>
      <span className={clsx('textstyle-title-lg')}>{title}</span>
      <Carousel
        hintNext={true} isLooping={true} isAutoLooping={true}
        className={"!h-[100px]"}
        /*itemWidths={{
          desktop: '20%',
          tablet: '33%',
          max-tablet: '50%'
        }}*/
        blurColor="transparent"
        autoLoopingTimeOut={1000}
        autoLoopAnimationTime={5000}
      >
        {partners.map(partner => (
          <div key={partner.name} className={clsx('col h-full items-center justify-center')}>
            <Image
              key={partner.name}
              width={0}
              height={0}
              src={partner.url}
              alt={partner.name}
              className={clsx('w-auto max-h-[100px] py-2 px-4')}
            />
          </div>
        ))}
      </Carousel>
    </div>
  )
}
