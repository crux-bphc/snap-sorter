FROM node:18-alpine as base

FROM base AS build

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn global add pnpm && pnpm i

COPY components ./components
COPY pages ./pages
COPY public ./public
COPY styles ./styles
COPY types ./types
COPY *.config.js .
COPY *.config.ts .
COPY tsconfig.json .
COPY .env.production .env
COPY prisma ./prisma

RUN pnpx prisma generate
RUN pnpm build

FROM base AS runner

WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public
COPY --from=build --chown=1001:1001 /app/.next/standalone ./
COPY --from=build --chown=1001:1001 /app/.next/static ./.next/static 

USER nextjs
CMD ["node", "server.js"]
