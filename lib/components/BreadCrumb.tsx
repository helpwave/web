import Link from 'next/link'
import clsx from 'clsx'

export type Crumb = {
  display: string,
  link: string,
}

type BreadCrumbProps = {
  crumbs: Crumb[],
  linkClassName?: string,
  containerClassName?: string,
}

/**
 * A component for showing a hierarchical link structure with an independent link on each element
 *
 * e.g. Organizations/Ward/<id>
 */
export const BreadCrumb = ({ crumbs, linkClassName, containerClassName }: BreadCrumbProps) => {
  return (
    <div className={clsx('@(flex flex-row)', containerClassName)}>
      {crumbs.map((crumb, index) => (
        <div key={index}>
          <Link href={crumb.link} className={clsx(linkClassName, { '@(text-gray-500 hover:text-black)': index !== crumbs.length - 1 })}>
            {crumb.display}
          </Link>
          {index !== crumbs.length - 1 && <span className={clsx('px-2 text-gray-500')}>/</span>}
        </div>
      ))}
    </div>
  )
}
