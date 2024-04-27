import type { HTMLAttributes, ReactNode } from 'react'
import { tx } from '@twind/core'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export type PageProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode,
  footer?: ReactNode,
  outerClassName?: string
}

/**
 * The template for any page component
 */
export const Page = ({
  children,
  header = (<Header/>),
  footer = (<Footer/>),
  className,
  outerClassName,
  ...restProps
}: PageProps) => {
  return (
    <div {...restProps}
         className={tx('w-screen h-screen relative overflow-x-hidden bg-white', outerClassName)}>
      {header}
      <main className={tx('w-full pt-16', className)}>
        {children}
        {footer}
      </main>
    </div>
  )
}
