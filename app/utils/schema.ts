import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({
      autoIncrement: true,
    }),
    email_address: text("email_address").notNull(),
    password: text("password"),
    name_first: text("name_first"),
    name_last: text("name_last"),
  },
  (users) => ({
    emailIdx: uniqueIndex("emailIdx").on(users.email_address),
  })
);

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
