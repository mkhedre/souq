import { isAdmin } from "@/lib/auth";
import { update, readDB } from "@/lib/db";
export function clean(b) {
  return { name: String(b.name || "").trim(), category: String(b.category || ""), price: Number(b.price) || 0, oldPrice: Number(b.oldPrice) || 0, icon: String(b.icon || "📦"), stock: Math.max(0, Math.floor(Number(b.stock) || 0)), description: String(b.description || ""), image: String(b.image || ""), active: b.active !== false, featured: !!b.featured };
}
export async function GET() { if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 }); return Response.json(readDB().products); }
export async function POST(req) {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const d = clean(await req.json());
  if (!d.name || d.price <= 0) return Response.json({ error: "الاسم والسعر مطلوبان" }, { status: 400 });
  const p = update((db) => { const id = Math.max(0, ...db.products.map((x) => x.id)) + 1; const p = { id, rating: 0, reviews: 0, ...d }; db.products.push(p); return p; });
  return Response.json(p);
}
