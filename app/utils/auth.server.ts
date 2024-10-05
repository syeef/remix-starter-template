import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { authSessionStorage } from "./session.server";

import { drizzle } from "drizzle-orm/d1";

export const authenticator = new Authenticator<{
  email: string;
  id: number;
}>(authSessionStorage);

authenticator.use(
  new FormStrategy(async ({ form, context }: any) => {
    const email_address = form.get("email");
    const password = form.get("password");

    const db = drizzle(context.cloudflare.env.DB);
    const possibleUser = await db
      .select({
        email_address: users.email_address,
        password: users.password,
        id: users.id,
      })
      .from(users)
      .where(eq(users.email_address, email_address))
      .get();

    if (!possibleUser) {
      throw new Error("Invalid email address or password.");
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      possibleUser.password as string
    );

    if (!passwordsMatch) {
      throw new Error("Invalid email address or password.");
    }
    return {
      email: possibleUser.email_address,
      id: possibleUser.id,
    };
  }),
  "form"
);
