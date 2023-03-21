FROM node:18.12.0 as build
ENV NEXT_TELEMETRY_DISABLED 1
ARG WS="@helpwave/web-dashboard"

# install pnpm
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /web

# copy all dependency declarations inside the container
COPY package*.json .
COPY pnpm*.yaml .
COPY tasks/package*.json ./tasks/
COPY lib/package*.json ./lib/

# install dependencies
RUN pnpm install --frozen-lockfile

# build tasks
COPY . .
RUN pnpm --filter $WS run build

FROM node:18.12.0-alpine

LABEL maintainer="tech@helpwave.de"

ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /web

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# copy transpiled app
COPY --from=build --chown=nextjs:nodejs /web/tasks/build/standalone ./
COPY --from=build --chown=nextjs:nodejs /web/tasks/public ./tasks/public
COPY --from=build --chown=nextjs:nodejs /web/tasks/build/static ./tasks/build/static

EXPOSE 80
ENV PORT 80
CMD ["node", "tasks/server.js"]
