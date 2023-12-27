declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string,
    NEXT_PUBLIC_API_URL?: string,
    NEXT_PUBLIC_MOCK?: string,
    NEXT_PUBLIC_SHOW_STAGING_DISCLAIMER_MODAL?: string,
    NEXT_PUBLIC_REQUEST_LOGGING?: string,
    NEXT_PUBLIC_PLAYSTORE_LINK?: string,
    NEXT_PUBLIC_APPSTORE_LINK?: string,
    NEXT_PUBLIC_OAUTH_ISSUER_URL?: string,
    NEXT_PUBLIC_OAUTH_REDIRECT_URI?: string,
    NEXT_PUBLIC_OAUTH_CLIENT_ID?: string,
    NEXT_PUBLIC_OAUTH_SCOPES?: string,
    NEXT_PUBLIC_FAKE_TOKEN_ENABLE?: string,
    NEXT_PUBLIC_FAKE_TOKEN?: string
  }
}
