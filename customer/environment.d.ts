// import '@helpwave/api-services/environment'
// ^ This import extends the namespace of the ProcessEnv

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string,
    NEXT_PUBLIC_API_URL: string,
    NEXT_PUBLIC_OIDC_PROVIDER: string,
    NEXT_PUBLIC_CLIENT_ID: string,
    NEXT_PUBLIC_REDIRECT_URI: string,
    NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI: string,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string,
  }
}
