import { update } from "@/lib/db";
import { timingSafeEqual } from "crypto";
export const dynamic = "force-dynamic";
const eq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const id = String(b.id || ""), token = String(b.token || "");
  const service = Math.floor(Number(b.service));
  if (!id || !token) return Response.json({ error: "رابط التقييم غير صالح" }, { status: 400 });
  if (!(service >= 1 && service <= 5)) return Response.json({ error: "قيّم الخدمة من ١ إلى ٥ نجوم" }, { status: 400 });
  if (!Array.isArray(b.items) || !b.items.length) return Response.json({ error: "قيّم منتجات الطلب" }, { status: 400 });
  try {
    const out = update((db) => {
      const o = db.orders.find((x) => String(x.id) === id);
      if (!o || !o.token || !eq(o.token, token)) throw new Error("رابط التقييم غير صالح");
      if (o.status !== "delivered") throw new Error("يمكنك التقييم بعد استلام الطلب فقط");
      if (o.rated) throw new Error("تم تقييم هذا الطلب من قبل");
      const itemStars = {};
      for (const it of b.items.slice(0, 50)) {
        const s = Math.floor(Number(it.stars));
        if (!o.items.some((x) => String(x.id) === String(it.id))) throw new Error("لا يمكن تقييم منتج لم يكن في هذا الطلب");
        if (!(s >= 1 && s <= 5)) throw new Error("قيمة التقييم يجب أن تكون بين ١ و ٥");
        itemStars[it.id] = s;
      }
      for (const x of o.items) if (!itemStars[x.id]) throw new Error("من فضلك قيّم كل منتجات الطلب");
      for (const [pid, s] of Object.entries(itemStars)) {
        const p = db.products.find((x) => String(x.id) === String(pid));
        if (p) {
          const rev = Number(p.reviews) || 0, rat = Number(p.rating) || 0;
          p.rating = Math.round(((rat * rev + s) / (rev + 1)) * 10) / 10;
          p.reviews = rev + 1;
        }
      }
      db.serviceRating = db.serviceRating || { sum: 0, count: 0 };
      db.serviceRating.sum += service; db.serviceRating.count += 1;
      o.rated = true;
      o.rating = { items: itemStars, service, at: new Date().toISOString() };
      return { ok: true };
    });
    return Response.json(out);
  } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
}
