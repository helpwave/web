import { tw } from '@helpwave/color-themes/twind'
import Link from 'next/link'

export type FooterLinkGroupProps = {
  title: string,
  links: {
    name: string,
    link: string,
    onClick?: () => void,
    openInCurrentTab?: boolean,
  }[],
}

const FooterLinkGroup = ({
  title,
  links,
}: FooterLinkGroupProps) => {
  return (
    <div className={tw('mb-8')}>
      <div className="py-2 font-semibold text-lg">{title}</div>
      <ul>
        {links.map(({ name, link, onClick, openInCurrentTab }) => (
          <li key={link}>
            <Link onClick={onClick} target={onClick === undefined ? (openInCurrentTab ? '_top' : '_blank') : ''} href={link} className={tw('py-1')}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterLinkGroup
