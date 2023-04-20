import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../../components/layout/TwoColumn'
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

type Room = {
  bedCount: number,
  name: string
}

type WardDTO = {
  id: string,
  name: string,
  rooms: Room[],
  unscheduled: number,
  inProgress: number,
  done: number
}

const WardsPage: NextPage = ({ language }: PropsWithLanguage<WardsPageTranslation>) => {
  const translation = useTranslation(language, defaultWardsPageTranslation)
  const [selectedWard, setSelectedWard] = useState<WardDTO | undefined>(undefined)

  const router = useRouter()
  const { uuid } = router.query
  const organizationUUID = uuid as string

  const createMutation = useCreateMutation(setSelectedWard, organizationUUID)
  const updateMutation = useUpdateMutation(setSelectedWard, organizationUUID)
  const deleteMutation = useDeleteMutation(setSelectedWard, organizationUUID)
  const { isLoading, isError, data } = useWardQuery()

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
        { display: translation.organizations, link: '/organizations' },
        { display: translation.wards, link: `/organizations/${organizationUUID}` }
      ]}
    >
      <Head>
        <title>{titleWrapper(translation.wards)}</title>
      </Head>

      <TwoColumn
        left={(
          <WardDisplay
            selectedWard={selectedWard}
            wards={data as WardDTO[]}
            onSelectionChange={setSelectedWard}
          />
        )}
        right={(
          <WardDetail
            key={selectedWard === undefined ? 'unselected' : selectedWard.name}
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
