import type { PropsWithChildren } from 'react'

import type { Crumb } from '@helpwave/hightide'
import { BreadCrumb } from '@helpwave/hightide'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { UserMenu } from '@/components/UserMenu'
import { Header, type HeaderProps } from '@/components/Header'

type PageWithHeaderProps = Partial<HeaderProps> & {
  crumbs?: Crumb[],
}

/**
 * The base of every page. It creates the configurable header
 *
 * The page content will be passed as the children
 */
export const PageWithHeader = ({
                                 children,
                                 title,
                                 withIcon = true,
                                 leftSide,
                                 rightSide,
                                 crumbs
                               }: PropsWithChildren<PageWithHeaderProps>) => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="col gap-y-0 w-screen h-screen overflow-hidden">
      <Header
        title={title}
        withIcon={withIcon}
        leftSide={[(crumbs ?
          <BreadCrumb crumbs={crumbs} containerClassName="max-tablet:hidden"/> : undefined), ...(leftSide ?? [])]}
        leftSideClassName="max-tablet:hidden"
        rightSide={[
          ...(rightSide ?? []),
          (<UserMenu key="usermenu"/>),
        ]}
      />
      {children}
    </div>
  )
}
