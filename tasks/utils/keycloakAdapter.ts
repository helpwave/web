// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

/**
 * keycloakAdapter.ts is adopted from https://github.com/keycloak/keycloak/blob/cdfd46f19110061f7783161c389365c9da844955/js/libs/keycloak-js/src/keycloak.js#L1312
 * This implementation injects ?prompt=select_account to all authentication requests
 */

import type Keycloak, { KeycloakAdapter, KeycloakLoginOptions } from 'keycloak-js'
import keycloak from '@/utils/keycloak';

function createPromise() {
  // Need to create a native Promise which also preserves the
  // interface of the custom promise type previously used by the API
  const p = {
    setSuccess: function(result) {
      p.resolve(result)
    },

    setError: function(result) {
      p.reject(result)
    }
  }

  p.promise = new Promise(function(resolve, reject) {
    p.resolve = resolve
    p.reject = reject
  })

  return p
}

export const loadKeycloakAdapter = (kc: Keycloak): KeycloakAdapter => {
  const redirectUri = function(options: KeycloakLoginOptions) {
    if (options && options.redirectUri) {
      return options.redirectUri
    } else if (kc.redirectUri) {
      return kc.redirectUri
    } else {
      return location.href
    }
  }

  return {
    login: function(options) {
      const u = new URL(kc.createLoginUrl(options))

      if (Object.keys(keycloak?.tokenParsed?.organization || []).length !== 0) {
        u.searchParams.set('prompt', 'select_account') // Shows the organization selector on login and re-login
      }

      window.location.assign(u)
      return createPromise().promise
    },

    logout: async function(options) {
      window.location.replace(kc.createLogoutUrl(options))
    },

    register: function(options) {
      window.location.assign(kc.createRegisterUrl(options))
      return createPromise().promise
    },

    accountManagement: function() {
      const accountUrl = kc.createAccountUrl()
      if (typeof accountUrl !== 'undefined') {
        window.location.href = accountUrl
      } else {
        throw 'Not supported by the OIDC server'
      }
      return createPromise().promise
    },

    redirectUri,
  }
}
