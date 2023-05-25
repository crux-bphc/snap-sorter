FROM node:18.15-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN yarn global add pnpm && pnpm i
COPY --chown=node:node src ./src
COPY --chown=node:node .env.development .
COPY --chown=node:node public ./public
COPY --chown=node:node next.config.js .
COPY --chown=node:node tsconfig.json .
ENV NEXT_TELEMETRY_DISABLED 1
CMD [ "pnpm", "dev"]
