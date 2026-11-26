import { checkCredentials, setSession, clearSession } from "@/lib/auth";
const hits = new Map();
export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "x"; const h = (hits.get(ip) || []).filter((t) => Date.now() - t < 6e4);
  if (h.length >= 8) return Response.json({ error: "محاولات كثيرة، حاول بعد دقيقة" }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  if (!checkCredentials(b.email, b.password)) { h.push(Date.now()); hits.set(ip, h); return Response.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 }); }
  await setSession(); return Response.json({ ok: true });
}
export async function DELETE() { await clearSession(); return Response.json({ ok: true }); }
