import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { isValidTheme } from "~/utils/theme.server";
import { useHints } from "../utils/client-hints";
import { useRequestInfo } from "~/utils/request-info";

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme() {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  return requestInfo.userPrefs.theme ?? hints.theme;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const theme = formData.get("theme");

  if (typeof theme !== "string" || !isValidTheme(theme)) {
    return Response.json({ error: "Invalid theme" }, { status: 400 });
  }

  const cookieHeader = `theme=${theme}; Path=/; HttpOnly; SameSite=Lax`;

  return Response.json(
    { success: true },
    {
      headers: {
        "Set-Cookie": cookieHeader,
      },
    }
  );
}
