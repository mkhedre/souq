import { readDB } from "@/lib/db";
import { timingSafeEqual } from "crypto";
export const dynamic = "force-dynamic";
const eq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };
export async function GET(req) {
  const list = String(new URL(req.url).searchParams.get("o") || "").split(",").slice(0, 30);
  const db = readDB(); const out = [];
  for (const it of list) {
    const [id, tok] = it.split(".");
    const o = db.orders.find((x) => String(x.id) === id);
    if (o && o.token && tok && eq(o.token, tok)) out.push({ id: o.id, status: o.status, total: o.total, createdAt: o.createdAt, history: o.history || [{ status: o.status, at: o.createdAt }] });
  }
  return Response.json(out, { headers: { "Cache-Control": "no-store" } });
}
