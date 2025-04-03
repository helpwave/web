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

type EmbeddedCheckoutButtonTranslation = {
  cancel: string,
  checkout: string,
}

const defaultEmbeddedCheckoutButtonTranslation: Translation<EmbeddedCheckoutButtonTranslation> = {
  en: {
    cancel: 'Cancel',
    checkout: 'Check Out'
  },
  en: {
    cancel: 'Abbrechen',
    checkout: 'Kasse'
  }
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

  const fetchClientSecret = useCallback(() => {
    return InvoiceAPI.pay(invoiceId, authHeader)
  }, [])

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
    <div id="checkout" className="my-4">
      <Button onClick={handleCheckoutClick}>
        {children}
      </Button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box w-100 max-w-screen-2xl">
          <h3 className="font-bold text-lg">{translation.checkout}</h3>
          <div className="py-4">
            {showCheckout && (
              <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                <EmbeddedCheckout/>
              </EmbeddedCheckoutProvider>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <Button className="btn" onClick={handleCloseModal}>
                {translation.cancel}
              </Button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}
