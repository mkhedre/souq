import fs from "fs";
import path from "path";
import crypto from "crypto";
import { isAdmin } from "@/lib/auth";
export const runtime = "nodejs";
const DIR = path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "uploads");
const MAX = 5 * 1024 * 1024;
// detect type from file bytes, not from the client-provided name/type
function sniff(b) {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.slice(0, 8).toString("hex") === "89504e470d0a1a0a") return "png";
  if (b.slice(0, 4).toString() === "RIFF" && b.slice(8, 12).toString() === "WEBP") return "webp";
  if (b.slice(0, 3).toString() === "GIF") return "gif";
  return null;
}
export async function POST(req) {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  let file;
  try { file = (await req.formData()).get("file"); } catch { return Response.json({ error: "ملف غير صالح" }, { status: 400 }); }
  if (!file || typeof file === "string") return Response.json({ error: "اختر صورة" }, { status: 400 });
  if (file.size > MAX) return Response.json({ error: "الصورة أكبر من 5 ميجا" }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = sniff(buf);
  if (!ext) return Response.json({ error: "الصيغة غير مدعومة (JPG, PNG, WEBP, GIF فقط)" }, { status: 400 });
  fs.mkdirSync(DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  fs.writeFileSync(path.join(DIR, name), buf);
  return Response.json({ url: `/api/uploads/${name}` });
}
