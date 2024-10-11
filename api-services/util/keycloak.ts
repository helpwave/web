import Keycloak from 'keycloak-js'
import { getAPIServiceConfig } from '../config/config'
import { loadKeycloakAdapter } from './keycloakAdapter'

let keycloakInstance: Keycloak | undefined

let isInitialized = false

if (typeof window !== 'undefined') {
  keycloakInstance = new Keycloak({
    url: 'https://accounts.helpwave.de',
    realm: 'helpwave',
    clientId: 'helpwave-tasks'
  })
}

export const KeycloakService = {
  initKeycloak: (keycloak: Keycloak) => {
    if (isInitialized && keycloak) return Promise.resolve(keycloak?.authenticated ?? false)

    isInitialized = true
    try {
      return keycloak.init({
        onLoad: 'login-required',
        useNonce: true,
        pkceMethod: 'S256',
        adapter: loadKeycloakAdapter(keycloak)
      })
    } catch (err) {
      isInitialized = false
      console.error(err)
      throw err
    }
  },
  getToken: async (minValidity = 30) => {
    if (!keycloakInstance) throw new Error('Keycloak uninitialized. Call initKeycloak before')
    return keycloakInstance
      .updateToken(minValidity)
      .then(() => {
        if (!keycloakInstance?.token) {
          throw new Error('no token after updateToken()')
        }
        return keycloakInstance.token
      })
      .catch((err) => {
        console.warn('failed to refresh token', err)
      })
  },
  getCurrentTokenAndUpdateInBackground: (minValidity = 30) => {
    const { fakeTokenEnable, fakeToken } = getAPIServiceConfig()
    if (fakeTokenEnable) return fakeToken
    KeycloakService.getToken(minValidity)
    return keycloakInstance?.token
  },
}

export default keycloakInstance
