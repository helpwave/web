import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../../components/layout/TwoColumn'
import type { WardDTO } from '../../mutations/ward_mutations'
import {
  useWardQuery,
  useCreateMutation,
  useDeleteMutation,
  useUpdateMutation
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

const emptyWard: WardDTO = {
  id: '',
  name: '',
  unscheduled: 0,
  inProgress: 0,
  done: 0,
  rooms: []
}

/**
 * The page for displaying and editing the wards within an organization
 */
const WardsPage: NextPage = ({ language }: PropsWithLanguage<WardsPageTranslation>) => {
  const translation = useTranslation(language, defaultWardsPageTranslation)
  const [selectedWard, setSelectedWard] = useState<WardDTO>(emptyWard)
  const [usedQueryParam, setUsedQueryParam] = useState(false)

  const router = useRouter()
  const { uuid, wardID } = router.query
  const organizationUUID = uuid as string

  const createMutation = useCreateMutation(ward => setSelectedWard(ward ?? emptyWard), organizationUUID)
  const updateMutation = useUpdateMutation(ward => setSelectedWard(ward ?? emptyWard), organizationUUID)
  const deleteMutation = useDeleteMutation(ward => setSelectedWard(ward ?? emptyWard), organizationUUID)
  const { isLoading, isError, data } = useWardQuery()

  if (wardID && !usedQueryParam) {
    const newSelected = data?.find(value => value.id === wardID) ?? emptyWard
    setSelectedWard(newSelected)
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
        left={() => (
          <WardDisplay
            selectedWard={selectedWard}
            wards={data as WardDTO[]}
            onSelectionChange={ward => setSelectedWard(ward ?? emptyWard)}
          />
        )}
        right={() => (
          <WardDetail
            key={selectedWard.id}
            ward={selectedWard}
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
