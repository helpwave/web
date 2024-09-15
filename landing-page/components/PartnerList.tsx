import { tw } from '@twind/core'
import Image from 'next/image'
import { VerticalDivider } from '@helpwave/common/components/VerticalDivider'
import { Span } from '@helpwave/common/components/Span'
import Scrollbars from 'react-custom-scrollbars-2'
import { DividerInserter } from '@helpwave/common/components/layout/DividerInserter'

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
      <Scrollbars
        autoHeight={true}
        autoHeightMax={120}
        universal={true}
      >
        <DividerInserter
          className={tw('flex flex-row gap-x-6 items-center')}
          divider={(index) => (<VerticalDivider key={index} height={120}/>)}
        >
          {partners.map(partner => (
            <Image
              key={partner.name}
              width={0}
              height={0}
              src={partner.url}
              alt={partner.name}
              className={tw('w-auto max-h-[60px]')}
            />
          ))}
        </DividerInserter>
      </Scrollbars>
    </div>
  )
}
