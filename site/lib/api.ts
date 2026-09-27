export const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, x-admin-token" };
export function json(data: unknown, init: ResponseInit = {}) { return Response.json(data, { ...init, headers: { ...corsHeaders, ...(init.headers ?? {}) } }); }
const productColors = new Set(["orange", "blue", "emerald", "violet", "rose", "cyan"]);
export function validateProduct(payload: unknown) {
  const value = (payload ?? {}) as Record<string, unknown>;
  const tags = String(value.industry ?? "").split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 8);
  const color = String(value.color ?? "orange");
  const featured = value.featured === true || value.featured === 1 || value.featured === "1" || value.featured === "true" || value.featured === "on";
  const product = { industry: [...new Set(tags)].join(", ").slice(0, 240), name: String(value.name ?? "").trim().slice(0, 120), idea: String(value.idea ?? "").trim().slice(0, 600), link: String(value.link ?? "").trim().slice(0, 1000), password: String(value.password ?? "").slice(0, 300), color: productColors.has(color) ? color : "orange", logoUrl: String(value.logoUrl ?? "").trim().slice(0, 1000), featured };
  if (!product.industry || !product.name || !product.idea || !product.link) throw new Error("Industry, product name, product idea, and link are required");
  let url: URL; try { url = new URL(product.link); } catch { throw new Error("Enter a valid link"); }
  if (!/^https?:$/.test(url.protocol)) throw new Error("Link must use http or https");
  if (product.logoUrl) { let logo: URL; try { logo = new URL(product.logoUrl); } catch { throw new Error("Enter a valid logo URL"); } if (!/^https?:$/.test(logo.protocol)) throw new Error("Logo URL must use http or https"); }
  return product;
}
