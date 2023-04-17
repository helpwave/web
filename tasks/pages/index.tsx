import type { NextPage } from 'next'
import Head from 'next/head'
import { tw } from '@helpwave/common/twind/index'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { WardServiceClient } from '../generated/Ward_svcServiceClientPb'
import { CreateWardRequest, GetWardRequest } from '../generated/ward_svc_pb'
import { PageWithHeader } from '../components/layout/PageWithHeader'
import titleWrapper from '../utils/titleWrapper'

const Home: NextPage = () => {
  const router = useRouter()
  const { user, logout, accessToken } = useAuth(() => router.push({ pathname: '/login', query: { back: true } }))

  const getWard = async (id: string) => {
    const wardService = new WardServiceClient('https://staging-api.helpwave.de/task-svc')

    const req = new GetWardRequest()
    req.setId(id)

    wardService.getWard(req, null)
      .then((res) => {
        console.log('call successful', res.getId(), res.getName())
      })
      .catch((err) => {
        console.error('call failed', err)
      })
  }

  const createWard = async (name: string) => {
    const wardService = new WardServiceClient('https://staging-api.helpwave.de/tasks-svc')

    const req = new CreateWardRequest()
    req.setName(name)

    wardService.createWard(req, null)
      .then((res) => {
        console.log('call successful', res.getId(), res.getName())
      })
      .catch((err) => {
        console.error('call failed', err)
      })
  }

  const createRandomWard = async () => createWard(`random_ward_${Date.now().toString()}`)

  console.log(user, accessToken)

  if (!user) return null

  // TODO: proper navigation links in header (what should they be?)
  return (
      <PageWithHeader>
        <Head>
          <title>{titleWrapper()}</title>
        </Head>

        <h1 className={tw('text-3xl font-bold underline')}>
          {`Hello ${user.displayName}`}
        </h1>

        <button onClick={() => logout(() => window.location.reload())}>Logout</button>

        <button onClick={() => getWard('9af360fc-f612-4752-9982-a596c62e85c7')}>Get ward (open console)</button>
        <button onClick={() => createRandomWard()}>Create random ward (open console)</button>
      </PageWithHeader>
  )
}

export default Home
