## Getting Started

1. Execute the following commands
```
pnpm install
cd ./tasks/
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

#### Code generation

[Follow the installation steps on github.com/grpc/grpc-web.](https://github.com/grpc/grpc-web#code-generator-plugin)

```bash
# Generate gRPC-web code for the ward-svc rpc service
protoc --proto_path=../../helpwave-services/proto/services/task_svc/v1 ward_svc.proto --js_out=import_style=commonjs:generated --grpc-web_out=import_style=typescript,mode=grpcwebtext:generated
```
