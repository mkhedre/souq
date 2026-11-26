import { readDB } from "@/lib/db";
export async function GET(req) {
  const u = new URL(req.url); const q = u.searchParams.get("q") || ""; const cat = u.searchParams.get("cat");
  let l = readDB().products.filter((p) => p.active);
  if (cat) l = l.filter((p) => p.category === cat);
  if (q) l = l.filter((p) => p.name.includes(q));
  return Response.json(l);
}
