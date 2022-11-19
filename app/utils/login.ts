import { z } from 'zod'
import api from './api'
import type { User } from '../hooks/useAuth'

const mockJwt = (type: 'refresh-token' | 'access-token', user: { fullName: string, displayName: string, email: string }) => {
  const btoa = <Input>(input: Input) => Buffer.from(JSON.stringify(input)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const header = { alg: 'HS256', typ: 'JWT' }
  const basePayload = {
    typ: type,
    iss: 'dev.auth.helpwave.de',
    aud: 'dev.web.helpwave.de',
    sub: 123456789,
    exp: (Date.now() / 1000) + type === 'access-token' ? (30 * 60) : (14 * 24 * 60 * 60), // 30 minutes for access token, 14 days for refresh token
    iat: Date.now() / 1000,
  }
  const userPayload: User = {
    id: 'd771be66-2252-46bd-9681-813baac5ae3f',
    fullName: user.fullName,
    displayName: user.displayName,
    email: user.email,
    avatarUrl: 'https://source.boringavatars.com/',
    role: 'admin',
    organizations: [
      {
        id: 'd45ddfc0-1fc3-4fa7-95e9-edd7d134103a',
        shortName: 'ABC',
        longName: 'Hospital ABC',
        avatarUrl: null,
        contactEmail: 'info@hospital-abc.example',
        role: '', // TODO: unimportant for now, will become important later
      }
    ]
  }
  const signature = 'invalid'

  return `${btoa(header)}.${btoa({ ...basePayload, user: userPayload })}.${signature}`
}

export type Credentials = {
  username: string,
  password: string
}

const jwtResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string().nullable()
})

const loginWithCredentials = (credentials: Credentials & { shouldRetrieveRefreshToken: boolean }) => {
  return api
    .post('/login/credentials', credentials)
    .mock({
      accessToken: mockJwt('access-token', { fullName: 'Max Mustermann', displayName: 'Max', email: 'user@dev.helpwave.de' }),
      refreshToken: credentials.shouldRetrieveRefreshToken ? mockJwt('refresh-token', { fullName: 'Max Mustermann', displayName: 'Max', email: 'user@dev.helpwave.de' }) : null
    })
    .json(jwtResponse)
}

const loginWithRefreshToken = (refreshToken: string) => {
  return api
    .post('/login/refresh-token', { token: refreshToken })
    .mock({ accessToken: mockJwt('refresh-token', { fullName: 'Max Mustermann', displayName: 'Max', email: 'user@dev.helpwave.de' }) })
    .json(jwtResponse)
}

export {
  mockJwt,
  loginWithCredentials,
  loginWithRefreshToken
}
