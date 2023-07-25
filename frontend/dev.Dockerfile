FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  fi

COPY pages ./pages
COPY components ./components
COPY public ./public
COPY styles ./styles
COPY *.config.js .
COPY tsconfig.json .
COPY .env.development .env
COPY prisma ./prisma
RUN pnpx prisma generate

ENV NEXT_TELEMETRY_DISABLED 1

CMD \
  if [ -f yarn.lock ]; then yarn dev; \
  elif [ -f package-lock.json ]; then npm run dev; \
  elif [ -f pnpm-lock.yaml ]; then pnpm dev; \
  else yarn dev; \
  fi
