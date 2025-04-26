export type Theme = "light" | "dark" | "system";

export function isValidTheme(value: string): value is Theme {
  return ["light", "dark", "system"].includes(value);
}

export function getTheme(request: Request): Theme {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );
  const theme = cookies.theme as Theme | undefined;
  return theme ?? "system";
}

export function resolveTheme(
  userPreference: Theme | null,
  systemPreference: "light" | "dark"
): "light" | "dark" {
  if (userPreference === "light" || userPreference === "dark") {
    return userPreference;
  }
  return systemPreference;
}
