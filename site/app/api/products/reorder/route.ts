import { getD1 } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { corsHeaders, json } from "@/lib/api";

export function OPTIONS() { return new Response(null, { status: 204, headers: corsHeaders }); }

export async function POST(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const payload = await request.json() as { productIds?: unknown };
    const productIds = Array.isArray(payload.productIds) ? payload.productIds.map(Number) : [];
    if (!productIds.length || productIds.some((id) => !Number.isSafeInteger(id) || id < 1) || new Set(productIds).size !== productIds.length) {
      return json({ error: "Provide each product ID exactly once" }, { status: 400 });
    }
    const db = getD1();
    const current = await db.prepare("SELECT id FROM products ORDER BY id ASC").all<{ id: number }>();
    const expected = current.results.map((row) => row.id).sort((a, b) => a - b);
    const supplied = [...productIds].sort((a, b) => a - b);
    if (expected.length !== supplied.length || expected.some((id, index) => id !== supplied[index])) {
      return json({ error: "Product list changed. Refresh and try again." }, { status: 409 });
    }
    await db.batch(productIds.map((id, index) => db.prepare("UPDATE products SET sort_order = ? WHERE id = ?").bind(index, id)));
    return json({ productIds });
  } catch (error) {
    console.error(error);
    return json({ error: "Could not save product order" }, { status: 500 });
  }
}
