import type { PropsWithChildren } from 'react'
import { tw } from '@helpwave/common/twind'
import type { Crumb } from '@helpwave/common/components/BreadCrumb'
import { BreadCrumb } from '@helpwave/common/components/BreadCrumb'
import { UserMenu } from '@/components/UserMenu'
import { Header, type HeaderProps } from '@/components/Header'
import { FeedbackButton } from '@/components/FeedbackButton'
import { useAuth } from '@/hooks/useAuth'

type PageWithHeaderProps = Partial<HeaderProps> & {
  crumbs?: Crumb[]
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
  const { user, redirectUserToOrganizationSelection } = useAuth()

  if (!user) return null

  const feedbackButton = <FeedbackButton/>
  const organization = <div onClick={() => redirectUserToOrganizationSelection()}>{user?.organization?.name}</div>
  const userMenu = <UserMenu />

  return (
    <div className={tw('w-screen h-screen flex flex-col')}>
      <Header
        title={title}
        withIcon={withIcon}
        leftSide={[(crumbs ? <BreadCrumb crumbs={crumbs}/> : undefined), ...(leftSide ?? [])]}
        rightSide={[...(rightSide ?? []), feedbackButton, organization, userMenu]}
      />
      {children}
    </div>
  )
}
