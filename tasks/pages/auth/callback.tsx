import type { NextPage } from 'next'
import { handleCodeExchange } from '../../utils/oauth'
import { COOKIE_ID_TOKEN_KEY, LOCALSTORAGE_HREF_AFTER_AUTH_KEY } from '../../hooks/useAuth'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useConfig } from '../../hooks/useConfig'

const AuthCallback: NextPage = () => {
  const { config } = useConfig()

  useEffect(() => {
    handleCodeExchange(config).then((tokens) => {
      Cookies.set(COOKIE_ID_TOKEN_KEY, tokens.id_token)

      const hrefAfterAuth = window.localStorage.getItem(LOCALSTORAGE_HREF_AFTER_AUTH_KEY)
      if (hrefAfterAuth) {
        window.localStorage.removeItem(LOCALSTORAGE_HREF_AFTER_AUTH_KEY)
        // .replace: The user should not be able to navigate back to the auth callback
        window.location.replace(hrefAfterAuth)
      }
    })
  })

  return null
}

export default AuthCallback
