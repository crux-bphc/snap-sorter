FROM node:18-alpine as base

FROM base AS build

WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn global add pnpm && pnpm i
COPY components ./components
COPY pages ./pages
COPY public ./public
COPY styles ./styles
COPY *.config.js .
COPY *.config.ts .
COPY tsconfig.json .
COPY next-env.d.ts .
COPY .env.production .
RUN pnpm build

FROM base AS runner

WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next ./.next
RUN yarn global add pnpm && pnpm i --prod
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

CMD ["pnpm", "start"]