import Keycloak from 'keycloak-js'
import { getConfig } from '@/utils/config'
import { loadKeycloakAdapter } from '@/utils/keycloakAdapter'

let keycloak: Keycloak | undefined

let isInitialized = false

if (typeof window !== 'undefined') {
  keycloak = new Keycloak({
    url: 'https://accounts.helpwave.de',
    realm: 'helpwave',
    clientId: 'helpwave-tasks'
  })
}

export const initKeycloak = (keycloak: Keycloak) => {
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
}

export const getToken = async (minValidity = 30) => {
  if (!keycloak) throw new Error('Keycloak uninitialized. Call initKeycloak before')
  return keycloak
    .updateToken(minValidity)
    .then(() => {
      if (!keycloak?.token) {
        throw new Error('no token after updateToken()')
      }
      return keycloak.token
    })
    .catch((err) => {
      console.warn('failed to refresh token', err)
    })
}

export const getCurrentTokenAndUpdateInBackground = (minValidity = 30) => {
  const { fakeTokenEnable, fakeToken } = getConfig()
  if (fakeTokenEnable) return fakeToken
  getToken(minValidity)
}

export default keycloak
