import Link from 'next/link'
import { tw, tx } from '../twind'

export type Crumb = {
  display: string,
  link: string,
}

type BreadCrumbProps = {
  crumbs: Crumb[],
}

/**
 * A component for showing a hierarchical link structure with an independent link on each element
 *
 * e.g. Organizations/Ward/<id>
 */
export const BreadCrumb = ({ crumbs }: BreadCrumbProps) => {
  return (
    <div className={tw('flex flex-row')}>
      {crumbs.map((crumb, index) => (
        <div key={index}>
          <Link href={crumb.link} className={tx({ 'text-gray-500 hover:text-black': index !== crumbs.length - 1 })}>
            {crumb.display}
          </Link>
          {index !== crumbs.length - 1 && <span className={tw('px-2 text-gray-500')}>/</span>}
        </div>
      ))}
    </div>
  )
}
