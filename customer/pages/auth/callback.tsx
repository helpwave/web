'use client'

import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useEffect, useState } from 'react'
import { handleCallback } from '@/api/auth/authService'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { Section } from '@/components/layout/Section'
import { tw } from '@twind/core'
import { Button } from '@helpwave/common/components/Button'

type AuthCallbackTranslation = {
  callback: string,
  authenticationFailure: string,
  home: string,
}

const defaultAuthCallbackTranslations: Record<Languages, AuthCallbackTranslation> = {
  en: {
    callback: 'Authentication-Callback',
    authenticationFailure: 'There was an error during authentication.',
    home: 'Back to main page'
  },
  de: {
    callback: 'Authentifizierung-Callback',
    authenticationFailure: 'There was an error during authentication.',
    home: 'Zurück zur Hauptseite'
  }
}

type AuthCallbackServerSideProps = {
  jsonFeed: unknown,
}

const AuthCallback: NextPage<PropsForTranslation<AuthCallbackTranslation, AuthCallbackServerSideProps>> = ({ overwriteTranslation }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const translation = useTranslation(defaultAuthCallbackTranslations, overwriteTranslation)
  const [hasError, setHasError] = useState<boolean>(false)

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
          setHasError(true)
        }
      }
    }

    checkAuthCallback().catch(console.error)
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page pageTitle={titleWrapper(translation.callback)} isHidingSidebar={true}>
      {hasError && (
        <Section>
          <span className={tw('text-hw-negative-400')}>{translation.authenticationFailure}</span>
          <Button onClick={() => router.push('/')}>{translation.home}</Button>
        </Section>
      )}
    </Page>
  )
}

export default AuthCallback
