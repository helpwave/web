import { tw } from '@helpwave/common/twind'
import type { HeaderProps } from '../Header'
import { Header } from '../Header'
import type { PropsWithChildren } from 'react'
import { UserMenu } from '../UserMenu'
import type { Crumb } from '../BreadCrumb'
import { BreadCrumb } from '../BreadCrumb'
import { useAuth } from '../../hooks/useAuth'

type PageWithHeaderProps = Partial<HeaderProps> & {
  crumbs?: Crumb[]
}

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

  const userMenu = <UserMenu />

  return (
    <div className={tw('w-screen h-screen flex flex-col')}>
      <Header
        title={title}
        withIcon={withIcon}
        leftSide={[(crumbs ? <BreadCrumb crumbs={crumbs}/> : undefined), ...(leftSide ?? [])]}
        rightSide={[...(rightSide ?? []), userMenu]}
      />
      {children}
    </div>
  )
}
