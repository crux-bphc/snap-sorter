FROM node:18-alpine AS base

FROM base AS builder

WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN  yarn global add pnpm && pnpm i
COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .
COPY .env.production .
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

FROM base AS runner

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node", "server.js"]
