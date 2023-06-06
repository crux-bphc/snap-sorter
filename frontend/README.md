# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

```bash
pnpm install

pnpm dev
```

### Using docker

- Rename `.env` to `.env.development` or to `.env.production` as per the context and change the values accordingly.

```bash
# To start
# Replace dev with prod to run prod
docker compose -f docker-compose.dev.yml up

# To stop
docker compose -f docker-compose.dev.yml down
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
