import type { ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { NavLink } from "@remix-run/react";

import { authenticator } from "~/utils/auth.server";
import { authSessionStorage } from "~/utils/session.server";

import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

import * as Form from "@radix-ui/react-form";

// Import components and their links
import { Input } from "~/components/ui/Input/Input";

export const links = () => [
  //   ...InputLinks(),
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

const validator = withZod(
  z.object({
    email: z
      .string()
      .email({ message: 'Include an "@" in the Email Address' })
      .min(2, { message: "Email Address is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
);

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.clone().formData();
  const result = await validator.validate(formData);
  if (result.error) {
    return validationError(result.error);
  }

  const cookieHeader = request.headers.get("Cookie");
  // const fSession = await flashSession.getSession(cookieHeader);
  let user = null;
  try {
    user = await authenticator.authenticate("form", request, {
      context: {
        formData,
        request,
        cloudflare: context.cloudflare,
      },
    });
  } catch (e) {
    console.log(e);
  }
  if (user) {
    const session = await authSessionStorage.getSession(cookieHeader);

    session.set("user", user);
    session.set("strategy", "form");
    return redirect("/", {
      headers: {
        "Set-Cookie": await authSessionStorage.commitSession(session),
      },
    });
  } else {
    return redirect("/login");
  }
}

export default function Login() {
  return (
    <>
      <h2>Welcome back to App.</h2>
      <p>
        New to App? <NavLink to="/register">Register</NavLink>
      </p>

      <Form.Root asChild>
        <ValidatedForm validator={validator} method="post" id="login">
          <Input
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            formId="login"
          />
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            formId="login"
          />
          <Form.Submit asChild>
            <button className="Button" style={{ marginTop: 10 }}>
              Login
            </button>
          </Form.Submit>
        </ValidatedForm>
      </Form.Root>
    </>
  );
}
