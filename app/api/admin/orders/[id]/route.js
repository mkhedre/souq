import { isAdmin } from "@/lib/auth";
import { update } from "@/lib/db";
import { STATUS } from "@/lib/status";
export async function PUT(req, { params }) {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params; const { status } = await req.json();
  if (!STATUS[status]) return Response.json({ error: "bad status" }, { status: 400 });
  const o = update((db) => {
    const o = db.orders.find((x) => String(x.id) === id); if (!o) return null;
    if (status === "cancelled" && o.status !== "cancelled") o.items.forEach((i) => { const p = db.products.find((x) => x.id === i.id); if (p) p.stock += i.qty; });
    if (o.status !== status) { o.history = [...(o.history || []), { status, at: new Date().toISOString() }]; }
    o.status = status; return o;
  });
  return o ? Response.json(o) : Response.json({ error: "not found" }, { status: 404 });
}
