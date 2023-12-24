import type { NextPage } from 'next'
import { useAuth } from '@/hooks/useAuth'

const Test: NextPage = () => {
  const { user, signOut } = useAuth()

  return (
    <>
      <p>{user?.email}</p>
      <button onClick={() => signOut()}>sign-out</button>
    </>
  )
}

export default Test
