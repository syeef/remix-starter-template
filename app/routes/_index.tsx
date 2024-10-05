import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";

import { useSubmit, useLoaderData } from "@remix-run/react";

import { authenticator } from "~/utils/auth.server";
import { users } from "~/utils/schema";

import { eq } from "drizzle-orm";

import { drizzle } from "drizzle-orm/d1";

// components

// styles
export const links = () => [
  // { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "App — Description of App",
    },
    {
      name: "description",
      content: "Description of App",
    },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const db = drizzle(context.cloudflare.env.DB);
  const userSession = await authenticator.isAuthenticated(request);
  if (!userSession) {
    return redirect("/login");
  }
  const user = await db
    .select({
      id: users.id,
      email: users.email_address,
      name_first: users.name_first,
      name_last: users.name_last,
    })
    .from(users)
    .where(eq(users.email_address, userSession.email))
    .get();
  if (!user) {
    return redirect("/login");
  }
  return json({
    user,
  });
}

export function GreetingMessage({ name }) {
  const greeting = () => {
    const today = new Date();
    const curHr = today.getHours();
    if (curHr >= 4 && curHr <= 11) {
      return `Good morning, ${name}`;
    } else if (curHr >= 12 && curHr <= 17) {
      return `Good afternoon, ${name}`;
    } else {
      return `Good evening, ${name}`;
    }
  };
  return greeting();
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <>
      <h4>
        <GreetingMessage name={data.user.name_first} />!
      </h4>
      <p>Welcome to App</p>

      <br />
      <button
        onClick={() => {
          submit(null, {
            method: "POST",
            action: "/action/logout",
          });
        }}
      >
        Log Out
      </button>
    </>
  );
}
