import { useState } from 'react'
import type { ReactNode } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { tw, tx } from '@helpwave/common/twind/index'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { Header } from '../components/Header'
import { UserMenu } from '../components/UserMenu'

import CheckIcon from '../icons/Check'

const tabs = [
  'general', 'account'
] as const

const SidebarItem = ({ text, icon, active, onClick }: { text: string, icon: ReactNode, active: boolean, onClick: () => void }) => (
  <li
    onClick={onClick}
    className={tx('m-1 py-1 px-2 text-slate-700 rounded cursor-pointer hover:bg-slate-100', { 'bg-slate-100': active })}
  >
    <div className={tw('flex')}>
      {icon}
      <span className={tw('pl-2')}>{text}</span>
    </div>
  </li>
)

const SettingsPage: NextPage = () => {
  const router = useRouter()
  const { user, logout, accessToken } = useAuth(() => router.push({ pathname: '/login', query: { back: true } }))
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('general')

  if (!user) return null

  return (
    <div className={tw('w-screen h-screen flex flex-col')}>
      <Head>
        <title>Settings</title>
      </Head>

      <Header title="helpwave" navigation={[
        { text: 'Dashboard', href: '/' },
        { text: 'Contact', href: '/contact' },
      ]} actions={[
        <UserMenu key="user-menu" user={user} />
      ]} />

      <div className={tw('p-4 w-full h-full')}>
        <h1 className={tw('text-xl text-slate-700')}>Settings</h1>

        <div className={tw('pt-2 flex w-full h-full')}>
          <div className={tw('sidebar shrink-0 w-56 h-full')}>
            <ul>
              <SidebarItem text="General" icon={<CheckIcon />} active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
              <SidebarItem text="Account" icon={<CheckIcon />} active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
            </ul>
          </div>
          <div className={tw('main w-full h-full overflow-scroll px-4 py-2')}>
            {activeTab}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
