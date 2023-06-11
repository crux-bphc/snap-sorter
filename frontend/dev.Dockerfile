FROM node:lts-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm i
COPY --chown=node:node *.config.js .
COPY --chown=node:node *.config.ts .
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node src ./src
COPY --chown=node:node static ./static
COPY --chown=node:node .npmrc .npmrc
COPY --chown=node:node .env.development .env.development
CMD ["pnpm","dev","--host"]
