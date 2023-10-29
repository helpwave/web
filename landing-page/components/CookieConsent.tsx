'use client'

import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import getConfig from './CookieConsentConfig'
import addEventListeners from './CookieConsentListeners'

const CookieConsentComponent = () => {
  useEffect(() => {
    addEventListeners()
    CookieConsent.run(getConfig())
  }, [])

  return (
    <>
    </>
  )
}

export default CookieConsentComponent
