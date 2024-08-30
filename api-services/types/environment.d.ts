declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL?: string,
    NEXT_PUBLIC_OFFLINE_API?: string,
    NEXT_PUBLIC_REQUEST_LOGGING?: string,
    NEXT_PUBLIC_OAUTH_ISSUER_URL?: string,
    NEXT_PUBLIC_OAUTH_REDIRECT_URI?: string,
    NEXT_PUBLIC_OAUTH_CLIENT_ID?: string,
    NEXT_PUBLIC_OAUTH_SCOPES?: string,
    NEXT_PUBLIC_FAKE_TOKEN_ENABLE?: string,
    NEXT_PUBLIC_FAKE_TOKEN?: string
  }
}
