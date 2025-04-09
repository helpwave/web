import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import titleWrapper from '@/utils/titleWrapper'

export type PageProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode,
  footer?: ReactNode,
  /**
   * An addition to the page title used to differentiate subpages
   */
  pageTitleAddition: string | undefined,
  outerClassName?: string,
}

/**
 * The template for any page component
 */
export const Page = ({
  children,
  header = (<Header/>),
  footer = (<Footer/>),
  pageTitleAddition,
  className,
  outerClassName,
  ...restProps
}: PageProps) => {
  return (
    <div {...restProps}
         className={clsx('w-screen h-screen relative overflow-x-hidden bg-white', outerClassName)}>
      {header}
      <Head>
        <title>{titleWrapper(pageTitleAddition)}</title>
      </Head>
      <main className={clsx('w-full pt-16', className)}>
        {children}
        {footer}
      </main>
    </div>
  )
}
