import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../../components/layout/TwoColumn'
import type { WardDetailDTO } from '../../mutations/ward_mutations'
import {
  useCreateMutation,
  useDeleteMutation,
  useUpdateMutation,
  useWardDetailsQuery,
  useWardOverviewsQuery
} from '../../mutations/ward_mutations'
import { WardDisplay } from '../../components/layout/WardDisplay'
import { WardDetail } from '../../components/layout/WardDetails'
import { PageWithHeader } from '../../components/layout/PageWithHeader'
import titleWrapper from '../../utils/titleWrapper'

type WardsPageTranslation = {
  wards: string,
  organizations: string
}

const defaultWardsPageTranslation = {
  en: {
    wards: 'Wards',
    organizations: 'Organization'
  },
  de: {
    wards: 'Stationen',
    organizations: 'Organisation'
  }
}

const emptyWard: WardDetailDTO = {
  id: '',
  name: '',
  rooms: [],
  task_templates: []
}

/**
 * The page for displaying and editing the wards within an organization
 */
const WardsPage: NextPage = ({ language }: PropsWithLanguage<WardsPageTranslation>) => {
  const translation = useTranslation(language, defaultWardsPageTranslation)
  const [selectedWardId, setSelectedWardId] = useState<string>()
  const [usedQueryParam, setUsedQueryParam] = useState(false)

  const router = useRouter()
  const { uuid, wardID } = router.query
  const organizationUUID = uuid as string

  const createMutation = useCreateMutation((ward) => setSelectedWardId(ward?.id))
  const updateMutation = useUpdateMutation((ward) => setSelectedWardId(ward?.id))
  const deleteMutation = useDeleteMutation((ward) => setSelectedWardId(ward?.id))
  const { isLoading, isError, data } = useWardOverviewsQuery()
  const { data: selectedWard } = useWardDetailsQuery(selectedWardId)

  if (wardID && !usedQueryParam) {
    setSelectedWardId(wardID as string)
    setUsedQueryParam(true)
  }

  // TODO add view for loading
  if (isLoading) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError) {
    return <div>Error Message</div>
  }

  return (
    <PageWithHeader
      crumbs={[
        { display: translation.organizations, link: `/organizations?organizationID=${organizationUUID}` },
        { display: translation.wards, link: `/organizations/${organizationUUID}` }
      ]}
    >
      <Head>
        <title>{titleWrapper(translation.wards)}</title>
      </Head>
      <TwoColumn
        disableResize={false}
        left={width => (
            <WardDisplay
              selectedWard={selectedWard}
              wards={data}
              onSelectionChange={ward => setSelectedWardId(ward?.id)}
              width={width}
            />
        )}
        right={width => (
            <WardDetail
              key={selectedWard?.id}
              width={width}
              ward={selectedWard ?? emptyWard}
              onCreate={createMutation.mutate}
              onUpdate={updateMutation.mutate}
              onDelete={deleteMutation.mutate}
            />
        )}
      />
    </PageWithHeader>
  )
}

export default WardsPage
