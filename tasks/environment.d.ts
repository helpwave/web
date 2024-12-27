// import '@helpwave/api-services/environment'
// ^ This import extends the namespace of the ProcessEnv

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string,
    NEXT_PUBLIC_SHOW_STAGING_DISCLAIMER_MODAL?: string,
    NEXT_PUBLIC_PLAYSTORE_LINK?: string,
    NEXT_PUBLIC_APPSTORE_LINK?: string,
    NEXT_PUBLIC_FEEDBACK_FORM_URL?: string,
    NEXT_PUBLIC_FEATURES_FEED_URL?: string,
    NEXT_PUBLIC_IMPRINT_URL?: string,
    NEXT_PUBLIC_PRIVACY_URL?: string,
  }
}
