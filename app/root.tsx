import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { ClientHintCheck, getHints } from "./utils/client-hints";
import { getTheme, resolveTheme } from "./utils/theme.server";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { type Theme } from "./utils/theme.server";
import { ThemeSelect } from "~/components/ui/ThemeSelect/ThemeSelect";

import styles from "./styles/root.module.scss";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: styles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userPrefsTheme = getTheme(request);
  const systemTheme = getHints(request).theme;
  const effectiveTheme = resolveTheme(userPrefsTheme, systemTheme);

  return Response.json({
    requestInfo: {
      hints: getHints(request),
      userPrefs: {
        theme: getTheme(request),
      },
      renderedTheme: { theme: effectiveTheme },
    },
  });
}

function Document({
  children,
  theme = "light",
  userPreference = "system", // What the user picked (light, dark, system) for <ThemeSelect>
}: {
  children: React.ReactNode;
  theme?: Theme;
  userPreference?: Theme; // User's selection ('light', 'dark', or 'system')
}) {
  return (
    <html lang="en" data-theme={theme}>
      <head>
        <ClientHintCheck />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ThemeSelect currentTheme={userPreference} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { requestInfo } = useLoaderData<typeof loader>();

  return (
    <Document
      theme={requestInfo.renderedTheme.theme}
      userPreference={requestInfo.userPrefs.theme}
    >
      <Outlet />
    </Document>
  );
}
