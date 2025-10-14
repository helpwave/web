import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import type { PropsForTranslation, Translation } from '@helpwave/hightide'
import {
  LoadingAndErrorComponent,
  LoadingAnimation,
  useLocalStorage,
  useResizeCallbackWrapper,
  useTranslation
} from '@helpwave/hightide'
import { useOrganizationsForUserQuery } from '@helpwave/api-services/mutations/users/organization_mutations'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import { DashboardDisplay } from '@/components/layout/DashboardDisplay'
import titleWrapper from '@/utils/titleWrapper'
import { fetchLocalizedNews } from '@/utils/news'
import { getConfig } from '@/utils/config'
import { StagingDisclaimerModal } from '@/components/modals/StagingDisclaimerModal'
import { Scrollbars } from 'react-custom-scrollbars-2'

const config = getConfig()

type DashboardTranslation = {
  dashboard: string,
}

const defaultDashboardTranslations: Translation<DashboardTranslation> = {
  en: {
    dashboard: 'Dashboard'
  },
  de: {
    dashboard: 'Dashboard'
  }
}

type DashboardServerSideProps = {
  jsonFeed: unknown,
}

export const getServerSideProps: GetServerSideProps<DashboardServerSideProps> = async () => {
  const json = await fetchLocalizedNews()
  return { props: { jsonFeed: json } }
}

const Dashboard: NextPage<PropsForTranslation<DashboardTranslation, DashboardServerSideProps>> = ({
                                                                                                    // jsonFeed,
                                                                                                    overwriteTranslation
                                                                                                  }) => {
  const translation = useTranslation([defaultDashboardTranslations], overwriteTranslation)
  const { isLoading, isError } = useOrganizationsForUserQuery()

  const [isStagingDisclaimerOpen, setStagingDisclaimerOpen] = useState(false)
  const { value: lastTimeStagingDisclaimerDismissed, setValue: setLastTimeStagingDisclaimerDismissed } = useLocalStorage('staging-disclaimer-dismissed-time', 0)

  const dismissStagingDisclaimer = () => {
    setLastTimeStagingDisclaimerDismissed(new Date().getTime())
    setStagingDisclaimerOpen(false)
  }

  useEffect(() => {
    const ONE_DAY = 1000 * 60 * 60 * 24
    if (config.showStagingDisclaimerModal && new Date().getTime() - lastTimeStagingDisclaimerDismissed > ONE_DAY) {
      setStagingDisclaimerOpen(true)
    }
  }, [lastTimeStagingDisclaimerDismissed])

  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>()

  useResizeCallbackWrapper(useCallback(() => {
    setHeight(ref.current?.offsetHeight)
  }, []))

  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current?.offsetHeight)
    }
  }, [isLoading, isError]) // Bound to loading state, because ref is not set before

  return (
    <PageWithHeader
      crumbs={[{ display: translation('dashboard'), link: '/' }]}
    >
      <Head>
        <title>{titleWrapper()}</title>
      </Head>

      <StagingDisclaimerModal
        isModal={false}
        onConfirm={dismissStagingDisclaimer}
        isOpen={isStagingDisclaimerOpen}
        className="w-200"
      />
      <div ref={ref} className="w-full h-full">
        <LoadingAndErrorComponent
          isLoading={isLoading}
          hasError={isError}
          loadingComponent={(<LoadingAnimation classname="h-full"/>)}
        >
          {/* TODO reenable once newsfeed is active again
          <TwoColumn
            disableResize={false}
            left={() => ((
                <DashboardDisplay/>
              )
            )}
            right={width => (
              <NewsFeed
                width={width}
                localizedNews={localizedNewsSchema.parse(jsonFeed) as LocalizedNews}
              />
            )}
          />
        */}
          <Scrollbars autoHeight={true} autoHeightMax={height}>
            <DashboardDisplay/>
          </Scrollbars>
        </LoadingAndErrorComponent>
      </div>
    </PageWithHeader>
  )
}

export default Dashboard
