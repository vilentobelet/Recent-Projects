import { env } from "cloudflare:workers";

import { corsHeaders, json } from "@/lib/api";

export function OPTIONS() { return new Response(null, { status: 204, headers: corsHeaders }); }

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  try {
    if (!env.BUCKET) return json({ error: "Logo storage is temporarily unavailable" }, { status: 503 });
    const key = (await params).key;
    if (!/^logo-[a-f0-9-]+\.(png|jpg|webp|gif)$/.test(key)) return json({ error: "Logo not found" }, { status: 404 });
    const object = await env.BUCKET.get(key);
    if (!object) return json({ error: "Logo not found" }, { status: 404 });
    const headers = new Headers(corsHeaders);
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    headers.set("x-content-type-options", "nosniff");
    return new Response(object.body, { headers });
  } catch (error) {
    console.error(error);
    return json({ error: "Could not load logo" }, { status: 500 });
  }
}
