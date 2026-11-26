"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Tile from "./Tile";
const empty = { name: "", category: "", price: "", oldPrice: "", stock: 50, description: "", image: "", active: true, featured: false };
export default function ProductsManager({ products, categories, currency }) {
  const [f, setF] = useState(null); const [err, setErr] = useState(""); const [up, setUp] = useState(false); const r = useRouter();
  const set = (k, v) => setF({ ...f, [k]: v });
  async function save(e) {
    e.preventDefault(); setErr("");
    const res = await fetch(f.id ? `/api/admin/products/${f.id}` : "/api/admin/products", { method: f.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    if (!res.ok) return setErr((await res.json()).error || "خطأ"); setF(null); r.refresh();
  }
  async function upload(e) {
    const file = e.target.files?.[0]; if (!file) return; setErr("");
    if (file.size > 5 * 1024 * 1024) { e.target.value = ""; return setErr("الصورة أكبر من 5 ميجا"); }
    setUp(true); const fd = new FormData(); fd.append("file", file);
    try { const res = await fetch("/api/admin/upload", { method: "POST", body: fd }); const j = await res.json(); if (!res.ok) setErr(j.error || "فشل الرفع"); else set("image", j.url); }
    catch { setErr("فشل الرفع"); }
    setUp(false); e.target.value = "";
  }
  async function del(p) { if (!confirm(`حذف ${p.name}؟`)) return; await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" }); r.refresh(); }
  return (<>
    <button className="btn" onClick={() => setF({ ...empty, category: categories[0]?.id })} style={{ marginBottom: 14 }}>+ منتج جديد</button>
    {f && <form className="panel" onSubmit={save}><h3 style={{ marginTop: 0 }}>{f.id ? "تعديل منتج" : "منتج جديد"}</h3>
      <div className="two"><div><label>الاسم</label><input required value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div><label>القسم</label><select value={f.category} onChange={(e) => set("category", e.target.value)}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label>السعر ({currency})</label><input type="number" step="0.01" required value={f.price} onChange={(e) => set("price", e.target.value)} /></div>
        <div><label>السعر قبل الخصم (اختياري)</label><input type="number" step="0.01" value={f.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} /></div>
        <div><label>المخزون</label><input type="number" value={f.stock} onChange={(e) => set("stock", e.target.value)} /></div>
        <div><label>صورة المنتج</label>
          {f.image && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><Tile name={f.name} image={f.image} className="sm" style={{ width: 56, height: 56, borderRadius: 10 }} /><button type="button" className="btn sm r" onClick={() => set("image", "")}>إزالة</button></div>}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={upload} disabled={up} />
          {up && <small>جاري الرفع...</small>}</div></div>
      <label>الوصف</label><textarea rows={2} value={f.description} onChange={(e) => set("description", e.target.value)} />
      <label><input type="checkbox" style={{ width: "auto" }} checked={f.active} onChange={(e) => set("active", e.target.checked)} /> ظاهر في المتجر</label>
      <label><input type="checkbox" style={{ width: "auto" }} checked={f.featured} onChange={(e) => set("featured", e.target.checked)} /> منتج مميز</label>
      {err && <div className="err">{err}</div>}
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}><button className="btn" disabled={up}>حفظ</button><button type="button" className="btn o" onClick={() => setF(null)}>إلغاء</button></div></form>}
    <table><thead><tr><th></th><th>المنتج</th><th>القسم</th><th>السعر</th><th>المخزون</th><th>الحالة</th><th></th></tr></thead><tbody>
      {products.map((p) => <tr key={p.id}><td><Tile name={p.name} image={p.image} className="sm" style={{ width: 38, height: 38, fontSize: 16, borderRadius: 10 }} /></td><td>{p.name}</td><td>{categories.find((c) => c.id === p.category)?.name}</td><td>{p.price.toLocaleString("ar-EG")}</td><td style={{ color: p.stock <= 20 ? "#dc2626" : "" }}>{p.stock.toLocaleString("ar-EG")}</td><td>{p.active ? "ظاهر" : "مخفي"}</td>
        <td style={{ whiteSpace: "nowrap" }}><button className="btn sm o" onClick={() => setF(p)}>تعديل</button> <button className="btn sm r" onClick={() => del(p)}>حذف</button></td></tr>)}</tbody></table></>);
}
