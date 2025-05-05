import type { PropsWithChildren } from 'react'
import clsx from 'clsx'
import type { Crumb } from '@helpwave/common/components/BreadCrumb'
import { BreadCrumb } from '@helpwave/common/components/BreadCrumb'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { UserMenu } from '@/components/UserMenu'
import { Header, type HeaderProps } from '@/components/Header'
import { FeedbackButton } from '@/components/FeedbackButton'

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
  const { user, redirectUserToOrganizationSelection } = useAuth()

  if (!user) return null

  const feedbackButton = <FeedbackButton/>
  const organization = <button onClick={() => redirectUserToOrganizationSelection()}>{user?.organization?.name}</button>
  const userMenu = <UserMenu />

  return (
    <div className={clsx('w-screen h-screen col')}>
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
