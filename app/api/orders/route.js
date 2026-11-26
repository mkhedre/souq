import { update, readDB } from "@/lib/db";
import { randomBytes } from "crypto";
import { waLink } from "@/lib/whatsapp";
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || "").trim(), phone = String(b.phone || "").trim(), address = String(b.address || "").trim();
  if (!name || !/^[0-9+\s-]{7,15}$/.test(phone) || !address) return Response.json({ error: "من فضلك أكمل الاسم ورقم موبايل صحيح والعنوان" }, { status: 400 });
  if (!Array.isArray(b.items) || !b.items.length) return Response.json({ error: "السلة فارغة" }, { status: 400 });
  try {
    const order = update((db) => {
      const items = b.items.map((it) => {
        const p = db.products.find((x) => x.id === Number(it.id) && x.active);
        const qty = Math.floor(Number(it.qty));
        if (!p || !(qty > 0)) throw new Error("منتج غير صالح");
        if (p.stock < qty) throw new Error(`الكمية المطلوبة من "${p.name}" غير متوفرة`);
        return { p, qty };
      });
      const sub = items.reduce((a, i) => a + i.p.price * i.qty, 0);
      const deliveryFee = sub >= db.settings.freeDeliveryFrom ? 0 : db.settings.deliveryFee;
      items.forEach((i) => (i.p.stock -= i.qty));
      const o = { id: db.nextOrderId++, name, phone, address, notes: String(b.notes || "").slice(0, 300), items: items.map((i) => ({ id: i.p.id, name: i.p.name, price: i.p.price, qty: i.qty })), subtotal: sub, deliveryFee, total: sub + deliveryFee, status: "new", token: randomBytes(8).toString("hex"), createdAt: new Date().toISOString(), history: [{ status: "new", at: new Date().toISOString() }] };
      db.orders.unshift(o); return o;
    });
    return Response.json({ id: order.id, token: order.token, wa: waLink(order, readDB().settings) });
  } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
}
