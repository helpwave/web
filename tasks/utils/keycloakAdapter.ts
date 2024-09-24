import type { KeycloakAdapter, KeycloakLoginOptions } from 'keycloak-js'
import type Keycloak from 'keycloak-js'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
function createPromise() {
  // Need to create a native Promise which also preserves the
  // interface of the custom promise type previously used by the API
  var p = {
    setSuccess: function(result) {
      p.resolve(result);
    },

    setError: function(result) {
      p.reject(result);
    }
  };
  p.promise = new Promise(function(resolve, reject) {
    p.resolve = resolve;
    p.reject = reject;
  });

  return p;
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
      u.searchParams.set('prompt', 'select_account')
      window.location.assign(u)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return createPromise().promise
    },

    logout: async function(options) {
      window.location.replace(kc.createLogoutUrl(options))
    },

    register: function(options) {
      window.location.assign(kc.createRegisterUrl(options))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return createPromise().promise
    },

    accountManagement: function() {
      const accountUrl = kc.createAccountUrl()
      if (typeof accountUrl !== 'undefined') {
        window.location.href = accountUrl
      } else {
        // eslint-disable-next-line no-throw-literal
        throw 'Not supported by the OIDC server'
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return createPromise().promise
    },

    redirectUri,
  }
}
