import { createCookieSessionStorage } from "@remix-run/cloudflare";

export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_auth_session_user",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["018d7b41-964a-7c4a-9a22-1031415477d9"],
    secure: true,
    maxAge: 60 * 60 * 24 * 30,
  },
});
