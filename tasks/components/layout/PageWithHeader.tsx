import { tw } from '@helpwave/common/twind'
import type { HeaderProps } from '../Header'
import { Header } from '../Header'
import type { PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../hooks/useAuth'
import { UserMenu } from '../UserMenu'

type PageWithHeaderProps = Partial<HeaderProps>

export const PageWithHeader = ({
  children,
  title,
  withIcon = true,
  leftSide,
  rightSide
}: PropsWithChildren<PageWithHeaderProps>) => {
  const router = useRouter()
  const user = useAuth(() => router.push({ pathname: '/login', query: { back: true } })).user

  if (!user) return null

  return (
    <div className={tw('w-screen h-screen flex flex-col')}>
      <Header
        title={title}
        withIcon={withIcon}
        leftSide={[...(leftSide ?? [])]}
        rightSide={[...(rightSide ?? []), (<UserMenu key={user.id} user={user}/>)]}
      />
      {children}
    </div>
  )
}
