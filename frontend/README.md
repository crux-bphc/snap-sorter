# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

```bash
pnpm install

pnpm dev
```

### Using docker

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

## Postgres DB Setup:

```
CREATE TABLE auth_user (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL
);
CREATE TABLE auth_session (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES auth_user(id) NOT NULL,
    active_expires BIGINT NOT NULL,
    idle_expires BIGINT NOT NULL
);
CREATE TABLE auth_key (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES auth_user(id) NOT NULL,
    primary_key BOOLEAN NOT NULL,
    hashed_password TEXT,
    expires BIGINT
);
```
