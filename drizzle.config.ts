import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/utils/schema.ts",
  dialect: "sqlite",
  out: "./drizzle",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
  verbose: true,
  strict: true,
});
