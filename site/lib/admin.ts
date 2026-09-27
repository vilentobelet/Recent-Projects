import { env } from "cloudflare:workers";

export function isAdmin(request: Request) {
  const configured = env.ADMIN_TOKEN;
  const supplied = request.headers.get("x-admin-token");
  return Boolean(configured && supplied && configured === supplied);
}

export function requireAdmin(request: Request) {
  if (isAdmin(request)) return null;
  return Response.json({ error: "Owner access required" }, { status: 401 });
}
