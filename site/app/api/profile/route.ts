import { getD1 } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { corsHeaders, json } from "@/lib/api";
import { isLoopbackRequest, mirrorLiveBoard } from "@/lib/live-board";

type Profile = { linkedinUrl: string; avatarUrl: string };

function validateProfile(payload: unknown): Profile {
  const value = (payload ?? {}) as Record<string, unknown>;
  const linkedinUrl = String(value.linkedinUrl ?? "").trim().slice(0, 1000);
  const avatarUrl = String(value.avatarUrl ?? "").trim().slice(0, 1000);

  if (linkedinUrl) {
    let url: URL;
    try { url = new URL(linkedinUrl); } catch { throw new Error("Enter a valid LinkedIn URL"); }
    const host = url.hostname.toLowerCase();
    if (!/^https?:$/.test(url.protocol) || (host !== "linkedin.com" && !host.endsWith(".linkedin.com"))) throw new Error("Enter a valid LinkedIn URL");
  }
  if (avatarUrl) {
    let url: URL;
    try { url = new URL(avatarUrl); } catch { throw new Error("Enter a valid avatar URL"); }
    if (!/^https?:$/.test(url.protocol)) throw new Error("Avatar URL must use http or https");
  }
  return { linkedinUrl, avatarUrl };
}

export function OPTIONS() { return new Response(null, { status: 204, headers: corsHeaders }); }

export async function GET(request: Request) {
  try {
    if (isLoopbackRequest(request)) {
      try {
        const live = await mirrorLiveBoard("/api/profile");
        if (live && typeof live === "object" && "profile" in live) return json(live);
      } catch { /* Fall through to the local database. */ }
    }
    const profile = await getD1().prepare("SELECT linkedin_url AS linkedinUrl, avatar_url AS avatarUrl FROM board_profile WHERE id = 1").first<Profile>();
    return json({ profile: profile ?? { linkedinUrl: "", avatarUrl: "" } });
  } catch (error) {
    console.error(error);
    return json({ error: "Owner profile is temporarily unavailable" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const profile = validateProfile(await request.json());
    const now = Date.now();
    await getD1().prepare("INSERT INTO board_profile (id, linkedin_url, avatar_url, updated_at) VALUES (1, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET linkedin_url = excluded.linkedin_url, avatar_url = excluded.avatar_url, updated_at = excluded.updated_at").bind(profile.linkedinUrl, profile.avatarUrl, now).run();
    return json({ profile });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not save owner profile" }, { status: 400 });
  }
}
