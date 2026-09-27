import { getD1 } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { corsHeaders, json, validateProduct } from "@/lib/api";
import catalog from "../../../../data/projects.json";

export function OPTIONS() { return new Response(null, { status: 204, headers: corsHeaders }); }
export async function GET() {
  try {
    const db = getD1();
    const count = await db.prepare("SELECT COUNT(*) AS count FROM products").first<{ count: number }>();
    if (!count?.count) {
      const now = Date.now();
      await db.batch(catalog.projects.map((product, index) => db.prepare("INSERT INTO products (industry, name, idea, link, password, color, logo_url, featured, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(product.industry, product.name, product.idea, product.link, product.password, product.color, product.logoUrl, product.featured ? 1 : 0, product.sortOrder ?? index, now, now)));
    }
    const result = await db.prepare("SELECT id, industry, name, idea, link, password, color, logo_url AS logoUrl, featured, sort_order AS sortOrder FROM products ORDER BY featured DESC, sort_order ASC, id ASC").all();
    return json({ products: result.results });
  } catch (error) { console.error(error); return json({ error: "Product data is temporarily unavailable" }, { status: 500 }); }
}

export async function POST(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const product = validateProduct(await request.json()); const db = getD1();
    const order = await db.prepare("SELECT COALESCE(MIN(sort_order), 0) - 1 AS nextOrder FROM products").first<{ nextOrder: number }>(); const now = Date.now();
    const result = await db.prepare("INSERT INTO products (industry, name, idea, link, password, color, logo_url, featured, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id").bind(product.industry, product.name, product.idea, product.link, product.password, product.color, product.logoUrl, product.featured ? 1 : 0, order?.nextOrder ?? -1, now, now).first();
    return json({ product: result }, { status: 201 });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Create failed" }, { status: 400 }); }
}
