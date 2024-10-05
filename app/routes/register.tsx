import type { MetaFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useActionData, NavLink } from "@remix-run/react";

import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

import { NewUser, users } from "~/utils/schema";
import bcrypt from "bcryptjs";

import * as Form from "@radix-ui/react-form";

// Import components and their links
import { Input } from "~/components/ui/Input/Input";
import { drizzle } from "drizzle-orm/d1";

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
  z
    .object({
      firstName: z.string().min(2, { message: "First Name is required" }),
      lastName: z.string().min(2, { message: "Last Name is required" }),
      email: z
        .string()
        .email({ message: 'Include an "@" in the Email Address' })
        .min(2, { message: "Email Address is required" }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
      confirmPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Enter the same password as above to confirm.",
      path: ["confirmPassword"],
    })
);

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const result = await validator.validate(formData);

    if (result.error) {
      return validationError(result.error);
    }

    const db = drizzle(context.cloudflare.env.DB);
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    const newUser: NewUser = {
      name_first: result.data.firstName,
      name_last: result.data.lastName,
      email_address: result.data.email,
      password: hashedPassword,
    };

    // Insert the new user
    await db.insert(users).values(newUser).run();

    // Redirect after successful registration
    return redirect("/login");
  } catch (err) {
    console.log(err.message);

    if (err.message.includes("constraint failed")) {
      return validationError({
        fieldErrors: {
          email: "Email Address already in use",
        },
      });
    }

    // Re-throw unexpected errors for further handling/logging
    throw err;
  }
}

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <>
      <h2>Create your App account.</h2>
      <p>
        Already have an account? <NavLink to="/login">Log in</NavLink>
      </p>

      <Form.Root asChild>
        <ValidatedForm validator={validator} method="post" id="register">
          <Input
            name="firstName"
            label="First Name"
            type="text"
            formId="register"
          />
          <Input
            name="lastName"
            label="Last Name"
            type="text"
            formId="register"
          />
          <Input
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            formId="register"
          />
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="Must be 8 characters or more"
            formId="register"
          />
          <Input
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            formId="register"
          />
          <Form.Submit asChild>
            <button className="Button" style={{ marginTop: 10 }}>
              Register with Email
            </button>
          </Form.Submit>
          {actionData?.error && <p>{actionData.error}</p>}
        </ValidatedForm>
      </Form.Root>
    </>
  );
}
