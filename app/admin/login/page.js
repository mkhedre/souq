"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { StoreIcon } from "@/components/Icons";
export default function Login() {
  const [f, setF] = useState({ email: "", password: "" }); const [err, setErr] = useState(""); const r = useRouter();
  async function go(e) { e.preventDefault(); const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (res.ok) r.push("/admin"); else setErr((await res.json()).error); }
  return (<div className="login-wrap"><form className="login-card" onSubmit={go}>
    <div className="mark"><StoreIcon size={28} /></div>
    <h2>لوحة التحكم</h2>
    <p>سجّل دخولك لإدارة المتجر</p>
    <label>البريد الإلكتروني</label><input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
    <label>كلمة المرور</label><input type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
    {err && <div className="err">{err}</div>}<button className="btn" style={{ width: "100%", marginTop: 16 }}>دخول</button></form></div>);
}
