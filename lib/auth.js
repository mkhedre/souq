import crypto from "crypto";
import { cookies } from "next/headers";
const SECRET = () => process.env.AUTH_SECRET || "dev-secret-change-me";
const sign = (v) => crypto.createHmac("sha256", SECRET()).update(v).digest("hex");
const eq = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && crypto.timingSafeEqual(x, y); };
export function checkCredentials(email, password) {
  const e = process.env.ADMIN_EMAIL || "admin@example.com";
  const p = process.env.ADMIN_PASSWORD || "admin123";
  return eq(String(email), e) && eq(String(password), p);
}
export async function setSession() {
  const exp = Date.now() + 7 * 864e5;
  const v = `admin.${exp}`;
  (await cookies()).set("session", `${v}.${sign(v)}`, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7 * 86400 });
}
export async function clearSession() { (await cookies()).delete("session"); }
export async function isAdmin() {
  const c = (await cookies()).get("session")?.value;
  if (!c) return false;
  const i = c.lastIndexOf(".");
  const v = c.slice(0, i), s = c.slice(i + 1);
  if (!eq(s, sign(v))) return false;
  return Number(v.split(".")[1]) > Date.now();
}
