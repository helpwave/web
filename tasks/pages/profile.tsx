import { useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { tw } from '@helpwave/common/twind/index'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { Button } from '../components/Button'
import { Input, noop } from '../components/user_input/Input'
import { Avatar } from '../components/Avatar'
import { UserCard } from '../components/cards/UserCard'
import { PageWithHeader } from '../components/layout/PageWithHeader'
import titleWrapper from '../utils/titleWrapper'

const Section = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <div className={tw('flex')}>
    <div className={tw('w-48 p-4 text-right')}>{title}</div>
    <div className={tw('w-72 p-4 space-y-6')}>{children}</div>
  </div>
)

const ProfilePage: NextPage = () => {
  const router = useRouter()
  const { user } = useAuth(() => router.push({ pathname: '/login', query: { back: true } }))

  const [fullName, setFullName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (user) {
      setFullName(user.fullName)
      setDisplayName(user.displayName)
      setAvatarUrl(user.avatarUrl)
    }
  }, [user])

  const discard = () => {
    if (user) {
      setFullName(user.fullName)
      setDisplayName(user.displayName)
      setAvatarUrl(user.avatarUrl)
    }
  }

  const save = () => {
    console.log('saving the following changes', {
      fullName,
      displayName
    })
  }

  if (!user) return null

  return (
    <PageWithHeader>
      <Head>
        <title>{titleWrapper('Profile')}</title>
      </Head>

      <div className={tw('p-4 w-full h-full')}>
        <h1 className={tw('text-xl text-slate-700 font-medium pb-2')}>Profile</h1>

        <Section title="This is how you appear to others">
          <UserCard user={{ ...user, fullName, displayName, avatarUrl }} />
        </Section>

        <hr />

        <Section title="Update your avatar">
          <Avatar avatarUrl={avatarUrl} alt="profile picture" size="large" />
          {/* For now this is just a text input for a url, this should become some kind of file chooser in the future */}
          <Input id="profile:avatar-url" label="Avatar URL" value={avatarUrl} onChange={setAvatarUrl} />
        </Section>

        <hr />

        <Section title="Update your display name and full name">
            <Input id="profile:displayname" label="Display name" value={displayName} onChange={setDisplayName} />
            <Input id="profile:fullname" label="Full name" value={fullName} onChange={setFullName} />
            <Input id="profile:email" label="Email" value={user.email} onChange={noop} disabled />

            <div className={tw('flex justify-end gap-2')}>

              <Button color="negative" variant="tertiary" onClick={discard}>
                Discard changes
              </Button>

              <Button color="accent" variant="primary" onClick={save}>
                Save
              </Button>

            </div>
        </Section>

        <hr />

        <Section title="Your organizations">
          {user.organizations.map((organization) => (
            <div key={organization.id} className={tw('flex items-center gap-2')}>
              {organization.shortName} ({organization.longName})
            </div>
          ))}
        </Section>

      </div>
    </PageWithHeader>
  )
}

export default ProfilePage
