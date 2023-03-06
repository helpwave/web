FROM node:18.12.0 as build
ENV NEXT_TELEMETRY_DISABLED 1
ARG WS="@helpwave/web-dashboard"

# install pnpm
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /web

# copy all dependency declerations inside the container
COPY package*.json .
COPY pnpm*.yaml .
COPY app/package*.json ./app/
COPY lib/package*.json ./lib/

# install depedencies
RUN pnpm install --frozen-lockfile

# build app
COPY . .
RUN pnpm --filter $WS run build

FROM node:18.12.0-alpine

LABEL maintainer="tech@helpwave.de"

ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /web

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# copy transpiled app
COPY --from=build --chown=nextjs:nodejs /web/app/build/standalone ./
COPY --from=build --chown=nextjs:nodejs /web/app/public ./app/public
COPY --from=build --chown=nextjs:nodejs /web/app/build/static ./app/build/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "app/server.js"]
