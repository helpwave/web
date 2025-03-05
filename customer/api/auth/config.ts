/// TODO change and move to env
export const OIDC_PROVIDER = 'http://localhost:8080/realms/myrealm'
export const CLIENT_ID = 'myclient'
export const CLIENT_SECRET = 'your-client-secret'
export const REDIRECT_URI = 'http://localhost:3000/'
export const TOKEN_URL = `${OIDC_PROVIDER}/token`
export const AUTH_URL = `${OIDC_PROVIDER}/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid profile email`
export const POST_LOGOUT_REDIRECT_URI = 'http://localhost:3000/'
