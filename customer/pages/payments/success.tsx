import type { Translation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { Page } from '@/components/layout/Page'
import { Section } from '@/components/layout/Section'
import titleWrapper from '@/utils/titleWrapper'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { loadStripe } from '@stripe/stripe-js'
import { STRIPE_PUBLISHABLE_KEY } from '@/api/config'
import Link from 'next/link'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'

type CheckOutReturnTranslation = {
  payment: string,
  paidSucessfully: string,
  paymentFailed: string,
  backToInvoice: string,
}

const defaultCheckOutReturnTranslation: Translation<CheckOutReturnTranslation> = {
  en: {
    payment: 'Payment',
    paidSucessfully: 'Payment was successful!',
    paymentFailed: 'Payment was not successful. Please try again later.',
    backToInvoice: 'Back to Invoices',
  },
  de: {
    payment: 'Bezahlung',
    paidSucessfully: 'Die Bezahlung war erfolgreich!',
    paymentFailed: 'Die Bezahlung war nicht erfolgreich. Versuchen Sie es später erneut.',
    backToInvoice: 'Zurück zu den Rechnungen.',
  }
}

type SessionStatus = 'invalid' | 'open' | 'complete'

const CheckoutReturn = () => {
  const translation = useTranslation(defaultCheckOutReturnTranslation)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>()
  //const [customerId] = useState<string>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    const fetchSession = async () => {
      const sessionId = searchParams.get('session_id')
      if (!sessionId) {
        router.push('/').catch(console.error)
        return
      }
      try {
        // TODO load status from backen here
        const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY)
        if (!stripe) {
          setSessionStatus('invalid')
          return
        }
        // setCustomerId(session.customer)
        // setSessionStatus(session.status)
        setSessionStatus('complete')
      } catch (err) {
        console.error('Error fetching session:', err)
        setError('Something went wrong. Please try again.')
      }
    }

    fetchSession().catch(console.error)
  }, [router, searchParams])

  let message: ReactNode = null
  if (error) {
    message = <p>{error}</p>
  } else {
    if (sessionStatus === 'invalid') {
      message = <p>Invalid session ID.</p>
    }
    if (sessionStatus === 'open') {
      message = <p>{translation.paymentFailed}</p>
    }
    if (sessionStatus === 'complete') {
      message = (<h3>{translation.paidSucessfully}</h3>)
    }
  }

  return (
    <Page pageTitle={titleWrapper(translation.payment)}>
      <Section titleText={translation.payment}>
        {message}
        <Link href="/invoices" className="rounded-md px-4 py-2 text-on-primary bg-primary hover:brightness-90">
          {translation.backToInvoice}
        </Link>
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(CheckoutReturn))
