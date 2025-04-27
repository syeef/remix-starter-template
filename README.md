# Get started with Remix (using Vite) + Drizzle ORM + Cloudflare Pages!

A starter template project using Remix (from create-cloudflare CLI aka c3) with Vite and Drizzle ORM on Cloudflare Pages.

- Theme support (Light, Dark, System)

## Initial Setup

### Install required packages and dependencies

Change the Node version using nvm to 20.17.0

```sh
nvm use 20.17.0
```

Install all the required packages

```sh
npm install
```

### Create a schema and D1 Database

Create a schema — This project contains details of a schema for a `users` table with the following columns `id`, `name_first`, `name_last`, `email_address`, and `password` within `app/utils/schema.ts`.

Make a database named "app-X” and then copy the output to the `wrangler.toml` file.

```sh
npx wrangler d1 create app-x
```

Review the binding name created to know what's available in your Worker on `env.DB`.

Create a `.env` file containing the following:

- CLOUDFLARE_ACCOUNT_ID — This is accessible from the Cloudflare Dash, Workers & Pages > Account ID (From the right hand side pane)
- CLOUDFLARE_D1_TOKEN — This is accessible from the Cloudflare Dash, however may need to be created from My Profile > API Tokens > Create Token > Create Custom Token (Get Started) > Permissions (Account | D1 | Edit)
- CLOUDFLARE_DATABASE_ID — Note this will have been given from creating the database in the previous step

Tell typescript that this database exists, run the below command to generate an interface in `worker.configuration.d.ts`.

```sh
npx wrangler types
```

The above command will adjust the `worker.configuration.d.ts` file to include the below. You should also see a similar output from the terminal.

```ts
interface Env {
  DB: D1Database;
}
```

There may be some content within the `load-context.ts` file, you need to ensure that the empty Env interface is removed.

```ts
- interface Env {}
```

You may need to restart the Typescript server to pick up the changes. In VS Code, open the command pallette with `CMD Shift P` and run `Typescript: Restart TS Server`.

### Prepare the migrations and apply them to D1

Prepare the migrations.

```sh
npm run generate
```

Apply migrations to the database named "app-x”. (Note — this database name should be the same as supplied earlier.)

```sh
npx wrangler d1 migrations apply app-x
```

## Development

Change the Node version using nvm to 20.17.0

```sh
nvm use 20.17.0
```

Run the dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

## Docs

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)
- 📖 [Cloudflare Pages using Remix docs](https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/)
