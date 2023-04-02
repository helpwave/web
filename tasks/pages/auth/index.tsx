import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { getAuthorizationUrl } from '../../utils/oauth'

const Auth: NextPage = () => {
  const [authorizationUrl, setAuthorizationUrl] = useState<string>()

  useEffect(() => {
    getAuthorizationUrl().then((url) => {
      console.log(url)
      setAuthorizationUrl(url)
    })
  }, [])

  return (
    <>
      { authorizationUrl && <a href={authorizationUrl}>{authorizationUrl}</a> }
    </>
  )
}

export default Auth
