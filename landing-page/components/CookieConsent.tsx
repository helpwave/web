'use client'

import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import pluginConfig from './CookieConsentConfig'

const CookieConsentComponent = () => {
  useEffect(() => {
    CookieConsent.run(pluginConfig)
  }, [])

  return (
    <>
    </>
  )
}

export default CookieConsentComponent
