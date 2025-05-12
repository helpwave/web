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
  const color = 'text-description'

  return (
    <div className={clsx('row', containerClassName)}>
      {crumbs.map((crumb, index) => (
        <div key={index}>
          <Link href={crumb.link} className={clsx(linkClassName, { [`${color} hover:brightness-60`]: index !== crumbs.length - 1 })}>
            {crumb.display}
          </Link>
          {index !== crumbs.length - 1 && <span className={clsx(`px-1`, color)}>/</span>}
        </div>
      ))}
    </div>
  )
}
