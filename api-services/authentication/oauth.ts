import type { AuthorizationServer, Client } from 'oauth4webapi'
import * as oauth from 'oauth4webapi'
import {
  authorizationCodeGrantRequest,
  discoveryRequest,
  generateRandomState,
  isOAuth2Error,
  processAuthorizationCodeOpenIDResponse,
  processDiscoveryResponse,
  validateAuthResponse
} from 'oauth4webapi'
import { getCookie, setCookie } from 'cookies-next'
import { getAPIServiceConfig } from '../config/config'

const config = getAPIServiceConfig()
const codeChallengeMethod = 'S256'

const LOCALSTORAGE_KEY_STATE = 'oauth_state'
const LOCALSTORAGE_KEY_CODE_VERIFIER = 'oauth_code_verifier'

const getAuthorizationServer = async (issuerUrl: string): Promise<AuthorizationServer> => {
  const issuer = new URL(issuerUrl)
  const authorizationServer = await discoveryRequest(issuer)
    .then((res) => processDiscoveryResponse(issuer, res))

  if (!authorizationServer.code_challenge_methods_supported?.includes(codeChallengeMethod)) {
    throw new Error('Authorization server does not support required code challenge')
  }

  return authorizationServer
}

const getCommonOAuthEntities = async (overrideConfig?: Partial<typeof config.oauth>): Promise<{ authorizationServer: AuthorizationServer, client: Client }> => {
  const { issuerUrl, clientId } = { ...config.oauth, ...overrideConfig }

  const authorizationServer = await getAuthorizationServer(issuerUrl)
  const client: Client = {
    client_id: clientId,
    token_endpoint_auth_method: 'none',
  }

  return { authorizationServer, client }
}

const storeValue = (key: string, value: string) => {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1)
  const secureCookie = config.env === 'production'
  setCookie(key, value, { expires: expiresAt, sameSite: 'lax', secure: secureCookie })
}

const retrieveValue = (key: string): string|null => {
  const value = getCookie(key)
  return typeof value === 'string' ? value : null
}

const setupState = (): string => {
  const state = generateRandomState()
  storeValue(LOCALSTORAGE_KEY_STATE, state)
  return state
}

const retrieveState = (): string => {
  const state = retrieveValue(LOCALSTORAGE_KEY_STATE)
  if (!state) throw new Error('State not set')
  return state
}

const setupCodeVerifier = (): string => {
  const codeVerifier = oauth.generateRandomCodeVerifier()
  storeValue(LOCALSTORAGE_KEY_CODE_VERIFIER, codeVerifier)
  return codeVerifier
}

const retrieveCodeVerifier = (): string => {
  const codeVerifier = retrieveValue(LOCALSTORAGE_KEY_CODE_VERIFIER)
  if (!codeVerifier) throw new Error('Code verifier not set')
  return codeVerifier
}

const buildAuthorizationUrl = (params: {
  baseUrl: string,
  clientId: string,
  codeChallenge: string,
  redirectUri: string,
  scopes: string[],
  state: string
}): URL => {
  const authorizationUrl = new URL(params.baseUrl)
  authorizationUrl.searchParams.set('client_id', params.clientId)
  authorizationUrl.searchParams.set('code_challenge', params.codeChallenge)
  authorizationUrl.searchParams.set('code_challenge_method', codeChallengeMethod)
  authorizationUrl.searchParams.set('redirect_uri', params.redirectUri)
  authorizationUrl.searchParams.set('response_type', 'code')
  authorizationUrl.searchParams.set('scope', params.scopes.join(' '))
  authorizationUrl.searchParams.set('state', params.state)
  return authorizationUrl
}

export const getAuthorizationUrl = async (): Promise<string> => {
  if (config.fakeTokenEnable) {
    const url = new URL(window.location.origin)
    url.pathname = '/auth/callback'
    url.searchParams.set('fake_token', config.fakeToken)
    return url.toString()
  }

  const { authorizationServer } = await getCommonOAuthEntities()

  if (!authorizationServer.authorization_endpoint) {
    throw new Error('No authorization_endpoint on authorization server')
  }

  const state = setupState()

  const codeVerifier = setupCodeVerifier()
  const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier)

  return buildAuthorizationUrl({
    baseUrl: authorizationServer.authorization_endpoint,
    clientId: config.oauth.clientId,
    codeChallenge,
    redirectUri: config.oauth.redirectUri,
    scopes: config.oauth.scopes,
    state
  }).toString()
}

export const handleCodeExchange = async (): Promise<{ id_token: string, refresh_token: string }> => {
  if (config.fakeTokenEnable) {
    const currentUrl = new URL(window.location.toString())
    const fakeToken = currentUrl.searchParams.get('fake_token')
    if (fakeToken) return { id_token: fakeToken, refresh_token: fakeToken }
  }

  // issuerUrl -> WORK AROUND - Ory does not set the "iss"-Claim of the Id Token to "auth.helpwave.de". We will ask Ory about this.
  const { authorizationServer, client } = await getCommonOAuthEntities()

  const state = retrieveState()
  const codeVerifier = retrieveCodeVerifier()

  const currentUrl = new URL(window.location.toString())
  const params = validateAuthResponse(authorizationServer, client, currentUrl, state)
  if (isOAuth2Error(params)) throw new Error(`OAuth error: ${params.error}`)

  const response = await authorizationCodeGrantRequest(authorizationServer, client, params, config.oauth.redirectUri, codeVerifier)
  const result = await processAuthorizationCodeOpenIDResponse(authorizationServer, client, response)
  if (isOAuth2Error(result)) throw new Error(`OAuth error: ${result.error}`)

  if (!result.refresh_token) throw new Error('No refresh_token in token response')

  return { id_token: result.id_token, refresh_token: result.refresh_token }
}
