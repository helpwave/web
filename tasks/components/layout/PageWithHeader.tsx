import { tw } from '@helpwave/common/twind'
import type { HeaderProps } from '../Header'
import { Header } from '../Header'
import type { PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import { useAuthOld } from '../../hooks/useAuthOld'
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
  const user = useAuth().user

  if (!user) return null

  return (
    <div className={tw('w-screen h-screen flex flex-col')}>
      <Header
        title={title}
        withIcon={withIcon}
        leftSide={[(crumbs ? <BreadCrumb crumbs={crumbs}/> : undefined), ...(leftSide ?? [])]}
        rightSide={[...(rightSide ?? []), (<UserMenu key={user.id} user={user}/>)]}
      />
      {children}
    </div>
  )
}
