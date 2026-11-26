"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SettingsForm({ settings, categories }) {
  const [s, setS] = useState(settings); const [cats, setCats] = useState(categories); const [msg, setMsg] = useState(""); const r = useRouter();
  const k = (key, label, type = "text") => <div><label>{label}</label><input type={type} value={s[key] ?? ""} onChange={(e) => setS({ ...s, [key]: e.target.value })} /></div>;
  async function save(e) { e.preventDefault(); const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings: s, categories: cats }) }); setMsg(res.ok ? "✓ تم الحفظ" : "حدث خطأ"); r.refresh(); }
  return (<form onSubmit={save}><div className="panel"><div className="two">{k("storeName", "اسم المتجر")}{k("phone", "رقم التواصل")}{k("whatsapp", "رقم واتساب لاستقبال الطلبات (مثال: 01012345678)")}{k("tagline", "الشعار النصي")}{k("banner", "شريط العروض (فارغ = إخفاء)")}{k("currency", "العملة")}{k("color", "اللون الرئيسي", "color")}{k("deliveryFee", "رسوم التوصيل", "number")}{k("freeDeliveryFrom", "توصيل مجاني من", "number")}</div></div>
    <div className="panel"><b>الأقسام</b>{cats.map((c, i) => <div className="row" key={i}>
      <input value={c.name} style={{ maxWidth: 220 }} onChange={(e) => setCats(cats.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
      <input value={c.image || ""} placeholder="رابط صورة القسم (اختياري)" dir="ltr" onChange={(e) => setCats(cats.map((x, j) => j === i ? { ...x, image: e.target.value } : x))} />
      <button type="button" className="btn sm r" onClick={() => setCats(cats.filter((_, j) => j !== i))}>حذف</button></div>)}
      <button type="button" className="btn sm o" onClick={() => setCats([...cats, { id: "c" + Date.now(), name: "قسم جديد", image: "" }])}>+ قسم</button></div>
    <button className="btn">حفظ الإعدادات</button> <span>{msg}</span></form>);
}
