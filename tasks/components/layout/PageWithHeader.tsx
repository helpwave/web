import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import type { Crumb } from '@helpwave/common/components/BreadCrumb'
import { BreadCrumb } from '@helpwave/common/components/BreadCrumb'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import type { OrganizationDTO } from '@helpwave/api-services/types/users/organizations'
import { UserMenu } from '@/components/UserMenu'
import { Header, type HeaderProps } from '@/components/Header'
import { FeedbackButton } from '@/components/FeedbackButton'
import { ProvideOrganization } from '@/hooks/useOrganization'

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
  const { user } = useAuth()
  const [isOrganizationSwitchModalOpen, setOrganizationSwitchModalOpen] = useState(false)
  const [organization, setOrganization] = useState<OrganizationDTO>()

  if (!user) return null

  const feedbackButton = <FeedbackButton/>
  const organizationName = (organization?.shortName && <Span onClick={() => setOrganizationSwitchModalOpen(true)} className={tw('cursor-pointer hover:cursor-pointer')}>{organization.shortName}</Span>)
  const userMenu = <UserMenu />

  return (
    <div className={tw('w-screen h-screen flex flex-col')}>
      <Header
        title={title}
        withIcon={withIcon}
        leftSide={[(crumbs ? <BreadCrumb crumbs={crumbs}/> : undefined), ...(leftSide ?? [])]}
        rightSide={[...(rightSide ?? []), feedbackButton, organizationName, userMenu]}
      />
      <ProvideOrganization
        organization={organization}
        setOrganization={setOrganization}
        isOrganizationSwitchModalOpen={isOrganizationSwitchModalOpen}
        setOrganizationSwitchModalOpen={setOrganizationSwitchModalOpen}
      >
        {children}
      </ProvideOrganization>
    </div>
  )
}
