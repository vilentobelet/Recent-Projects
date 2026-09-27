import { isAdmin } from "@/lib/admin";
import { corsHeaders, json } from "@/lib/api";
export function OPTIONS() { return new Response(null, { status: 204, headers: corsHeaders }); }
export function GET(request: Request) { return isAdmin(request) ? json({ ok: true }) : json({ error: "Owner access required" }, { status: 401 }); }
