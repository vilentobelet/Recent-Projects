import { env } from "cloudflare:workers";

import { requireAdmin } from "@/lib/admin";
import { corsHeaders, json } from "@/lib/api";

const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export function OPTIONS() { return new Response(null, { status: 204, headers: corsHeaders }); }

export async function POST(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    if (!env.BUCKET) return json({ error: "Logo storage is temporarily unavailable" }, { status: 503 });
    const form = await request.formData();
    const file = form.get("logo");
    if (!(file instanceof File)) return json({ error: "Choose an image file" }, { status: 400 });
    const extension = allowedTypes.get(file.type);
    if (!extension) return json({ error: "Use a PNG, JPG, WebP, or GIF image" }, { status: 400 });
    if (!file.size || file.size > 3 * 1024 * 1024) return json({ error: "Logo must be smaller than 3 MB" }, { status: 400 });
    const key = `logo-${crypto.randomUUID()}.${extension}`;
    await env.BUCKET.put(key, file.stream(), { httpMetadata: { contentType: file.type }, customMetadata: { originalName: file.name.slice(0, 180) } });
    const origin = new URL(request.url).origin;
    return json({ logoUrl: `${origin}/api/logos/${key}` }, { status: 201 });
  } catch (error) {
    console.error(error);
    return json({ error: "Could not upload logo" }, { status: 500 });
  }
}
