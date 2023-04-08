import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { tw } from '@helpwave/common/twind/index'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { Header } from '../components/Header'
import { UserMenu } from '../components/UserMenu'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../components/layout/TwoColumn'
import {
  useWardQuery,
  useCreateMutation,
  useDeleteMutation,
  useUpdateMutation
} from '../mutations/ward_mutations'
import { WardDisplay } from '../components/layout/WardDisplay'
import { WardDetail } from '../components/layout/WardDetails'

type WardsPageTranslation = {
  wards: string
}

const defaultWardsPageTranslation = {
  en: {
    wards: 'Wards'
  },
  de: {
    wards: 'Stationen'
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
  const { user, logout, accessToken } = useAuth(() => router.push({ pathname: '/login', query: { back: true } }))

  const createMutation = useCreateMutation(setSelectedWard)
  const updateMutation = useUpdateMutation(setSelectedWard)
  const deleteMutation = useDeleteMutation(setSelectedWard)
  const { isLoading, isError, data, error } = useWardQuery()

  if (!user) return null

  // TODO add view for loading
  if (isLoading) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError) {
    return <div>Error Message</div>
  }

  return (
    <div className={tw('w-screen h-screen flex flex-col')}>
      <Head>
        <title>{translation.wards}</title>
      </Head>

      <Header
        title="helpwave"
        navigation={[
          { text: 'Dashboard', href: '/' },
          { text: 'Contact', href: '/contact' },
        ]}
        actions={[<UserMenu key="user-menu" user={user}/>]}
      />
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
    </div>
  )
}

export default WardsPage
