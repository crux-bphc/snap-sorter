# TODO: Update this to according to the latest decisions
FROM node:lts-alpine as base

FROM base AS build

WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn global add pnpm && pnpm i
COPY src ./src
COPY static ./static
COPY  *.config.js .
COPY  *.config.ts .
COPY  tsconfig.json .
COPY tsconfig.json .
COPY .env.production .
RUN pnpm build

FROM base AS runner

WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/build ./build
RUN yarn global add pnpm && pnpm i --prod
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltejs
USER sveltejs

CMD ["node", "build"]
