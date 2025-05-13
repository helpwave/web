import Image from 'next/image'
import { Carousel } from '@helpwave/hightide/components/layout/Carousel'

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
    <div className="col gap-y-4 items-center w-full">
      <span className="textstyle-title-lg">{title}</span>
      <Carousel
        hintNext={true} isLooping={true} isAutoLooping={true}
        heightClassName="h-[8rem]"
        widthClassName="max-tablet:w-1/2 tablet:w-1/3 desktop:w-[30%]"
        blurColor="dark:from-background transparent"
        autoLoopingTimeOut={1000}
        autoLoopAnimationTime={5000}
      >
        {partners.map(partner => (
          <div key={partner.name} className="col h-full items-center justify-center rounded-lg mx-2 dark:bg-white">
            <Image
              key={partner.name}
              width={0}
              height={0}
              src={partner.url}
              alt={partner.name}
              className="w-auto max-h-[100px] p-4"
            />
          </div>
        ))}
      </Carousel>
    </div>
  )
}
