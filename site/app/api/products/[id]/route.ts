import { getD1 } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { corsHeaders, json, validateProduct } from "@/lib/api";
export function OPTIONS() { return new Response(null, { status: 204, headers: corsHeaders }); }
function productId(value: string) { const id = Number(value); if (!Number.isSafeInteger(id) || id < 1) throw new Error("Invalid product"); return id; }
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  try { const id = productId((await params).id); const product = validateProduct(await request.json()); const result = await getD1().prepare("UPDATE products SET industry = ?, name = ?, idea = ?, link = ?, password = ?, color = ?, logo_url = ?, featured = ?, updated_at = ? WHERE id = ? RETURNING id").bind(product.industry, product.name, product.idea, product.link, product.password, product.color, product.logoUrl, product.featured ? 1 : 0, Date.now(), id).first(); if (!result) return json({ error: "Product not found" }, { status: 404 }); return json({ product: result }); }
  catch (error) { return json({ error: error instanceof Error ? error.message : "Update failed" }, { status: 400 }); }
}
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  try { const id = productId((await params).id); const result = await getD1().prepare("DELETE FROM products WHERE id = ? RETURNING id").bind(id).first(); if (!result) return json({ error: "Product not found" }, { status: 404 }); return json({ deleted: id }); }
  catch (error) { return json({ error: error instanceof Error ? error.message : "Delete failed" }, { status: 400 }); }
}
