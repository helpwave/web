import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import { UserMenu } from '@/components/UserMenu'
import { Header, type HeaderProps } from '@/components/Header'
import { BreadCrumb, type Crumb } from '@/components/BreadCrumb'
import { FeedbackButton } from '@/components/FeedbackButton'
import { useAuth } from '@/hooks/useAuth'
import { ProvideOrganization } from '@/hooks/useOrganization'
import type { OrganizationDTO } from '@/mutations/organization_mutations'

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
