import { isAdmin } from "@/lib/auth";
import { update } from "@/lib/db";
export async function PUT(req) {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json();
  update((db) => {
    const s = db.settings, i = b.settings || {};
    for (const k of ["storeName", "tagline", "currency", "phone", "banner", "whatsapp"]) if (typeof i[k] === "string") s[k] = i[k];
    if (/^#[0-9a-fA-F]{6}$/.test(i.color || "")) s.color = i.color;
    for (const k of ["deliveryFee", "freeDeliveryFrom"]) if (!isNaN(Number(i[k]))) s[k] = Number(i[k]);
    if (Array.isArray(b.categories)) db.categories = b.categories.filter((c) => c.id && c.name).map((c) => ({ id: String(c.id), name: String(c.name), image: String(c.image || "") }));
  });
  return Response.json({ ok: true });
}
