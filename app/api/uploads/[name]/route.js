import fs from "fs";
import path from "path";
export const runtime = "nodejs";
const DIR = path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "uploads");
const TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };
export async function GET(_, { params }) {
  const { name } = await params;
  if (!/^[\w-]+\.(jpg|png|webp|gif)$/.test(name)) return new Response("not found", { status: 404 });
  try {
    const b = fs.readFileSync(path.join(DIR, name));
    return new Response(b, { headers: { "Content-Type": TYPES[name.split(".").pop()], "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response("not found", { status: 404 }); }
}
