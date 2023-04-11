import { tw, tx } from '@helpwave/common/twind'
import Link from 'next/link'

type Crumb = {
  display: string,
  link: string
}

type BreadCrumbProps = {
  crumbs: Crumb[]
}

export const BreadCrumb = ({ crumbs }: BreadCrumbProps) => {
  return (
    <div className={tw('flex flex-row')}>
      {crumbs.map((crumb, index) => (
        <div key={crumb.link}>
          <Link href={crumb.link} className={tx({ 'text-gray-300': index !== crumbs.length - 1 })}>
            {crumb.display}
          </Link>
          {index !== crumbs.length - 1 && <span className={tw('px-2 text-gray-300')}>/</span>}
        </div>
      ))}
    </div>
  )
}
