import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { handleCodeExchange } from '../../utils/oauth'
import type { OpenIDTokenEndpointResponse } from 'oauth4webapi'

const AuthCallback: NextPage = () => {
  const [token, setToken] = useState<OpenIDTokenEndpointResponse>()

  useEffect(() => {
    handleCodeExchange().then((token) => {
      console.log(token)
      setToken(token)
    })
  }, [])

  return (
    <>
      { token && <p>{token.id_token}</p> }
    </>
  )
}

export default AuthCallback
