# helpwave api-services
This package provides easy to use classes and data types for the helpwave ecosystem.

Make sure to adapt a next .env file for your setting by changing the environment
variable to your needs.

## Environment Variables
# Environment Variables Documentation

| Name                              | Type   | Description                                                                                |
| ---------------------------------- | ------ |--------------------------------------------------------------------------------------------|
| `NODE_ENV`                         | string | Defines the environment in which the application is running (`development`, `production`). |
| `NEXT_PUBLIC_API_URL`              | string | The base URL for the API that the frontend will communicate with.                          |
| `NEXT_PUBLIC_OFFLINE_API`          | string | Whether to use the offilne mode (`true`, `false`).                                         |
| `NEXT_PUBLIC_REQUEST_LOGGING`      | string | Enables logging of API requests if set to `true`.                                          |
| `NEXT_PUBLIC_OAUTH_ISSUER_URL`     | string | The OAuth issuer URL for authentication.                                                   |
| `NEXT_PUBLIC_OAUTH_REDIRECT_URI`   | string | The URI where the OAuth provider will redirect after authentication.                       |
| `NEXT_PUBLIC_OAUTH_CLIENT_ID`      | string | The client ID for OAuth authentication.                                                    |
| `NEXT_PUBLIC_OAUTH_SCOPES`         | string | The requested scopes for OAuth authentication.                                             |
| `NEXT_PUBLIC_FAKE_TOKEN_ENABLE`    | string | Enables the use of a fake token for testing purposes if set to `true`.                     |
| `NEXT_PUBLIC_FAKE_TOKEN`           | string | The fake token value to be used when `NEXT_PUBLIC_FAKE_TOKEN_ENABLE` is `true`.            |
