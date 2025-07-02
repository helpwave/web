'use client'

import type { NextPage } from 'next'
import type { Translation } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useEffect, useState } from 'react'
import { handleCallback } from '@/api/auth/authService'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { Section } from '@/components/layout/Section'
import { SolidButton } from '@helpwave/hightide'

type AuthCallbackTranslation = {
  callback: string,
  authenticationFailure: string,
  home: string,
}

const defaultAuthCallbackTranslations: Translation<AuthCallbackTranslation> = {
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
        console.debug('Processing OIDC callback...')
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
      <Section>
        {hasError && (
          <span className="text-negative">{translation.authenticationFailure}</span>
        )}
        <SolidButton onClick={() => router.push('/')}>{translation.home}</SolidButton>
      </Section>
    </Page>
  )
}

export default AuthCallback
