## Getting Started

1. Execute the following commands
```
pnpm install
cd tasks/
pnpm run dev
```
2. open http://localhost:3000

## Environment variables

> See `utils/config.ts` for more.

Create a file called `env.local` from the already existing `.env` file.

At build time and at runtime the correctness of the environment variables is validated, make sure that they are present at each step (even in github actions or similar).

If something is incorrect or missing an error will be thrown.

### gRPC-web

To communicate with [`helpwave-services`](https://github.com/helpwave/services) (our gRPC APIs) this projects uses gRPC-web.

