import { useFetcher } from "@remix-run/react";
import type { Theme } from "~/utils/theme.server.ts";

export function ThemeSelect({ currentTheme }: { currentTheme: Theme }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action="/resources/theme-switch">
      <label htmlFor="theme-select">Appearance:</label>
      <select
        id="theme-select"
        name="theme"
        defaultValue={currentTheme}
        onChange={(e) => fetcher.submit(e.currentTarget.form)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </fetcher.Form>
  );
}
