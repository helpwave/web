import type { NextPage } from 'next'
import Head from 'next/head'
import { tw } from '@helpwave/common/twind/index'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { Header } from '../components/Header'
import { UserMenu } from '../components/UserMenu'
import type * as grpcWeb from 'grpc-web'
import { WardServiceClient } from '../generated/Ward-svcServiceClientPb'
import type { GetWardResponse } from '../generated/ward-svc_pb'
import { GetWardRequest } from '../generated/ward-svc_pb'

const Home: NextPage = () => {
  const router = useRouter()
  const { user, logout, accessToken } = useAuth(() => router.push({ pathname: '/login', query: { back: true } }))

  const getWard = () => {
    const wardService = new WardServiceClient('https://staging-api.helpwave.de/task-svc', null, null)

    const req = new GetWardRequest()
    req.setId('11402cd5-4748-43b0-9868-cc0dd71244b3')

    wardService.getWard(req, null, (err: grpcWeb.RpcError, res: GetWardResponse) => {
      if (err) {
        console.error('call failed', err)
        return
      }
      console.log('call successful', res.getId(), res.getName())
    })
  }

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

        <button onClick={() => getWard()}>Get ward (open console)</button>
      </div>
  )
}

export default Home
