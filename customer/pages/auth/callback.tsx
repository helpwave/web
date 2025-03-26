'use client'

import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useEffect } from 'react'
import { handleCallback } from '@/api/auth/authService'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

type AuthCallbackTranslation = {
  callback: string,
}

const defaultAuthCallbackTranslations: Record<Languages, AuthCallbackTranslation> = {
  en: {
    callback: 'Authentication-Callback'
  },
  de: {
    callback: 'Authentifizierung-Callback'
  }
}

type AuthCallbackServerSideProps = {
  jsonFeed: unknown,
}

const AuthCallback: NextPage<PropsForTranslation<AuthCallbackTranslation, AuthCallbackServerSideProps>> = ({ overwriteTranslation }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const translation = useTranslation(defaultAuthCallbackTranslations, overwriteTranslation)

  useEffect(() => {
    const checkAuthCallback = async () => {
      // Check if the URL contains OIDC callback params
      if (searchParams.get('code') && searchParams.get('state')) {
        console.log('Processing OIDC callback...')
        try {
          await handleCallback()
          const redirect = searchParams.get('redirect_uri')
          const isValidRedirect = redirect && new URL(redirect).host === window.location.host
          const defaultRedirect = '/'
          if (!isValidRedirect) {
            console.warn(`Redirect URL is invalid, redirecting to default route ${defaultRedirect}`)
            await router.push(defaultRedirect)
          } else {
            console.info(`Redirecting to ${redirect ?? defaultRedirect}`)
            await router.push(redirect ?? defaultRedirect)
          }
        } catch (error) {
          console.error('OIDC callback error:', error)
          // TODO show error
          await router.push('/')
        }
      }
    }

    checkAuthCallback().catch(console.error)
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page pageTitle={titleWrapper(translation.callback)} isHidingSidebar={true}/>
  )
}

export default AuthCallback
