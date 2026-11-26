import { isAdmin } from "@/lib/auth";
import { update } from "@/lib/db";
import { clean } from "../route";
export async function PUT(req, { params }) {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params; const d = clean(await req.json());
  const p = update((db) => { const p = db.products.find((x) => String(x.id) === id); if (p) Object.assign(p, d); return p; });
  return p ? Response.json(p) : Response.json({ error: "not found" }, { status: 404 });
}
export async function DELETE(_, { params }) {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params; update((db) => { db.products = db.products.filter((x) => String(x.id) !== id); });
  return Response.json({ ok: true });
}
