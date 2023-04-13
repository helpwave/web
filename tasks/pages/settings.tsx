import { useState } from 'react'
import type { ReactNode } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { tw, tx } from '@helpwave/common/twind/index'
import CheckIcon from '../icons/Check'
import { PageWithHeader } from '../components/layout/PageWithHeader'

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
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('general')

  return (
    <PageWithHeader>
      <Head>
        <title>Settings</title>
      </Head>

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
    </PageWithHeader>
  )
}

export default SettingsPage
