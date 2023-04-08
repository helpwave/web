import type { NextPage } from 'next'
import Head from 'next/head'
import { tw } from '@helpwave/common/twind/index'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { Header } from '../components/Header'
import { UserMenu } from '../components/UserMenu'
import { WardServicePromiseClient } from '@helpwave/proto-ts/proto/services/task_svc/v1/ward_svc_grpc_web_pb'
import { GetWardRequest, CreateWardRequest } from '@helpwave/proto-ts/proto/services/task_svc/v1/ward_svc_pb'

const Home: NextPage = () => {
  const router = useRouter()
  const { user, logout, accessToken } = useAuth(() => router.push({ pathname: '/login', query: { back: true } }))

  const getWard = async (id: string) => {
    const wardService = new WardServicePromiseClient('https://staging-api.helpwave.de/task-svc')

    const req = new GetWardRequest()
    req.setId(id)

    wardService.getWard(req).then(response => console.log(response))
  }

  const createWard = async (name: string) => {
    const wardService = new WardServicePromiseClient('https://staging-api.helpwave.de/tasks-svc')

    const req = new CreateWardRequest()
    req.setName(name)

    wardService.createWard(req).then(response => console.log(response))
  }

  const createRandomWard = async () => createWard(`random_ward_${Date.now().toString()}`)

  console.log(user, accessToken)

  if (!user) return null

  // TODO: proper navigation links in header (what should they be?)
  return (
      <div className={tw('w-screen h-screen flex flex-col')}>
        <Head>
          <title>Create Next App</title>
        </Head>

        {/* all of these links are to be determined, these are just some placeholders */}
        <Header title="helpwave" navigation={[
          { text: 'Dashboard', href: '/' },
          { text: 'Contact', href: '/contact' },
        ]} actions={[
          <UserMenu key="user-menu" user={user} />
        ]} />

        <h1 className={tw('text-3xl font-bold underline')}>
          {user === null ? 'Redirecting to log in page..' : `Hello ${user.displayName}`}
        </h1>

        <button onClick={() => logout(() => window.location.reload())}>Logout</button>

        <button onClick={() => getWard('9af360fc-f612-4752-9982-a596c62e85c7')}>Get ward (open console)</button>
        <button onClick={() => createRandomWard()}>Create random ward (open console)</button>
      </div>
  )
}

export default Home
