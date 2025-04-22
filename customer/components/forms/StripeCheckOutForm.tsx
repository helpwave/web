'use client'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js'
import type { PropsWithChildren } from 'react'
import { useCallback, useRef, useState } from 'react'
import { InvoiceAPI } from '@/api/services/invoice'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@helpwave/common/components/Button'
import { STRIPE_PUBLISHABLE_KEY } from '@/api/config'
import type { Translation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@twind/core'
import { useLanguage } from '@helpwave/common/hooks/useLanguage'

type EmbeddedCheckoutButtonTranslation = {
  cancel: string,
  checkout: string,
}

const defaultEmbeddedCheckoutButtonTranslation: Translation<EmbeddedCheckoutButtonTranslation> = {
  en: {
    cancel: 'Cancel',
    checkout: 'Check Out',
  },
  de: {
    cancel: 'Abbrechen',
    checkout: 'Kasse',
  },
}


export type EmbeddedCheckoutButtonProps = PropsWithChildren<{
  invoiceId: string,
}>

export default function EmbeddedCheckoutButton({ children, invoiceId }: EmbeddedCheckoutButtonProps) {
  const translation = useTranslation(defaultEmbeddedCheckoutButtonTranslation)
  const { authHeader } = useAuth()
  const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
  const [showCheckout, setShowCheckout] = useState(false)
  const modalRef = useRef<HTMLDialogElement>(null)
  const language = useLanguage()

  const fetchClientSecret = useCallback(() => {
    const locale = language.language

    return InvoiceAPI.pay(invoiceId, locale, authHeader)
  }, [language.language, authHeader, invoiceId])

  const options = { fetchClientSecret }

  const handleCheckoutClick = () => {
    setShowCheckout(true)
    modalRef.current?.showModal()
  }

  const handleCloseModal = () => {
    setShowCheckout(false)
    modalRef.current?.close()
  }

  return (
    <div id="checkout">
      <Button onClick={handleCheckoutClick}>
        {children}
      </Button>
      <dialog ref={modalRef} className={tw('w-full h-full max-w-[90vw] max-h-[90vh] rounded-lg overflow-hidden')}>
        <div className={tw('flex flex-col justify-between gap-y-4 w-full h-full overflow-auto')}>
          <h3 className={tw('font-bold text-2xl')}>{translation.checkout}</h3>
          {showCheckout && (
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
          <form method="dialog">
            <Button onClick={handleCloseModal}>
              {translation.cancel}
            </Button>
          </form>
        </div>
      </dialog>
    </div>
  )
}
