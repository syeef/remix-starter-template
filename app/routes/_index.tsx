import type { MetaFunction } from "@remix-run/cloudflare";
import { NavLink } from "@remix-run/react";

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

export default function Index() {
  return (
    <>
      <h1>
        <p>Welcome to init!</p>
      </h1>

      <p>A starter project to help build ideas quickly.</p>

      <ul>
        <li>Remix + Vite</li>
        <li>Deployed to Cloudflare</li>
        <li>Using Cloudflare D1 (SQLite) with Drizzle ORM</li>
      </ul>

      <NavLink to="/register">Register</NavLink>
      <br />
      <NavLink to="/login">Login</NavLink>
    </>
  );
}
