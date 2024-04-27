import { tw } from '@twind/core'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { VerticalDivider } from '@helpwave/common/components/VerticalDivider'
import { Span } from '@helpwave/common/components/Span'
import Scrollbars from "react-custom-scrollbars-2";

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
  const nodes: ReactNode[] = []

  for (let index = 0; index < partners.length; index++) {
    const partner = partners[index]
    if (partner !== undefined) {
      const image = (
        <Image
          key={partner.name}
          width={0}
          height={0}
          src={partner.url}
          alt={partner.name}
          className={tw('w-auto max-h-[60px]')}
        />
      )
      nodes.push(image)
      if (index < partners.length - 1) {
        nodes.push(<VerticalDivider key={index} height={120}/>)
      }
    }
  }

  return (
    <div className={tw('flex flex-col gap-y-4 items-center w-full')}>
      <Span type="title" className={tw('!text-2xl')}>{title}</Span>
      <Scrollbars
        autoHeight={true}
        autoHeightMax={120}
        universal={true}
      >
        <div className={tw('flex flex-row gap-x-6 items-center')}>
          {nodes}
        </div>
      </Scrollbars>
    </div>
  )
}
