import { Span } from '@helpwave/common/components/Span'
import { tw } from '@helpwave/common/twind'
import Link from 'next/link'

export type FooterLinkGroupProps = {
  title: string,
  links: { name: string, link: string }[]
}

const FooterLinkGroup = ({
  title,
  links
}: FooterLinkGroupProps) => {
  return (
    <div className={tw('mb-8')}>
      <Span type="subsectionTitle">{title}</Span>
      {links.map(({ name, link }) => (
        <div key={link}>
          <Link target="_blank" href={link} className={tw('py-1')}>{name}</Link>
        </div>
      ))}
    </div>
  )
}

export default FooterLinkGroup
