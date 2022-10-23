import { z } from 'zod'
import api from './api'

const mockJwt = (type: 'refresh-token' | 'access-token', username: string) => {
  const btoa = <Input>(input: Input) => Buffer.from(JSON.stringify(input)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const header = { alg: 'HS256', typ: 'JWT' }
  const basePayload = {
    typ: type,
    iss: 'dev.auth.helpwave.de',
    aud: 'dev.web.helpwave.de',
    sub: 123456789,
    exp: (Date.now() / 1000) + 30 * 60 * 60,
    iat: Date.now() / 1000,
  }
  const userPayload = {
    username
  }
  const signature = 'invalid'

  return `${btoa(header)}.${btoa({ ...basePayload, user: userPayload })}.${signature}`
}

export type Credentials = {
  username: string,
  password: string
}

const jwtResponse = z.object({
  jwt: z.string()
})

// TODO: implement shouldRetrieveRefreshToken functionality
const loginWithCredentials = (credentials: Credentials & { shouldRetrieveRefreshToken: boolean }) => {
  return api
    .post('/login/credentials', credentials)
    .mock({ jwt: mockJwt('access-token', 'user@dev.helpwave.de') })
    .json(jwtResponse)
    .then(json => json.jwt)
}

const loginWithRefreshToken = (refreshToken: string) => {
  return api
    .post('/login/refresh-token', { token: refreshToken })
    .mock({ jwt: mockJwt('refresh-token', 'user@dev.helpwave.de') })
    .json(jwtResponse)
    .then(json => json.jwt)
}

export {
  mockJwt,
  loginWithCredentials,
  loginWithRefreshToken
}
