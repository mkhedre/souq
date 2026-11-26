"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Tile from "./Tile";
import { getCart, setCart } from "./cart";
import { saveMyOrder } from "./track";
import { TruckIcon, ShieldIcon, CartIcon } from "./Icons";
export default function CartView({ products, settings: s }) {
  const [cart, setC] = useState({}); const [ready, setReady] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", address: "", notes: "" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const router = useRouter();
  useEffect(() => { setC(getCart()); setReady(true); }, []);
  const change = (id, d) => { const c = { ...cart }; c[id] = (c[id] || 0) + d; if (c[id] <= 0) delete c[id]; setC(c); setCart(c); };
  const items = products.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] }));
  const sub = items.reduce((a, i) => a + i.price * i.qty, 0);
  const fee = items.length && sub < s.freeDeliveryFrom ? s.deliveryFee : 0;
  const missing = Math.max(0, s.freeDeliveryFrom - sub);
  const pct = Math.min(100, Math.round((sub / s.freeDeliveryFrom) * 100));
  const n = (v) => v.toLocaleString("ar-EG");
  async function submit(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, items: items.map((i) => ({ id: i.id, qty: i.qty })) }) });
    const d = await r.json(); setBusy(false);
    if (!r.ok) return setErr(d.error || "حدث خطأ");
    setCart({}); saveMyOrder(d.id, d.token, "new");
    const page = `/order/${d.id}?t=${d.token}`;
    if (d.wa) { window.location.href = d.wa; setTimeout(() => router.push(page), 1500); } else router.push(page);
  }
  if (!ready) return null;
  if (!items.length) return (
    <div className="panel emptycart">
      <span className="ec-ic"><CartIcon size={40} /></span>
      <h3>سلتك فارغة</h3>
      <p>أضف منتجات من المتجر وهتلاقيها هنا.</p>
      <Link href="/" className="btn" style={{ display: "inline-flex" }}>ابدأ التسوّق</Link>
    </div>
  );
  return (
    <div className="cols">
      <div>
        <div className={`shipbar panel ${missing > 0 ? "" : "done"}`}>
          {missing > 0
            ? <p><TruckIcon size={18} /> أضف منتجات بقيمة <b>{n(missing)} {s.currency}</b> واحصل على <b>توصيل مجاني</b></p>
            : <p><TruckIcon size={18} /> مبروك! طلبك مؤهل للتوصيل المجاني</p>}
          <div className="track"><div className="fill" style={{ width: pct + "%" }} /></div>
        </div>
        <div className="panel">{items.map((i) => (
          <div className="row" key={i.id}>
            <div className="ic"><Tile name={i.name} image={i.image} className="sm" style={{ fontSize: 22 }} /></div>
            <div className="grow"><b>{i.name}</b><div className="unit">{n(i.price)} {s.currency} / قطعة</div></div>
            <div className="qty"><button onClick={() => change(i.id, -1)}>−</button><b>{n(i.qty)}</b><button onClick={() => change(i.id, 1)}>+</button></div>
            <b style={{ width: 90, textAlign: "end" }}>{n(i.price * i.qty)}</b>
          </div>))}
        </div>
      </div>
      <form className="panel" onSubmit={submit}>
        <h3 style={{ marginTop: 0 }}>إتمام الطلب عبر واتساب (دفع عند الاستلام)</h3>
        <label>الاسم</label><input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="اسمك الكامل" />
        <label>رقم الموبايل</label><input required inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="01xxxxxxxxx" />
        <label>العنوان</label><textarea required rows={2} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} placeholder="الشارع، رقم العمارة، الدور، الشقة" />
        <label>ملاحظات (اختياري)</label><input value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
        <hr style={{ border: 0, borderTop: "1px solid #e5e7eb", margin: "14px 0" }} />
        <div className="row"><span className="grow">المجموع</span><b>{n(sub)} {s.currency}</b></div>
        <div className="row"><span className="grow">التوصيل</span><b>{fee ? `${n(fee)} ${s.currency}` : "مجاني"}</b></div>
        <div className="row"><span className="grow">الإجمالي</span><b style={{ fontSize: 20 }}>{n(sub + fee)} {s.currency}</b></div>
        {err && <div className="err">{err}</div>}
        <button className="btn big" style={{ width: "100%", marginTop: 10 }} disabled={busy}>{busy ? "جارٍ فتح واتساب..." : "تأكيد الطلب عبر واتساب"}</button>
        <div className="securenote"><ShieldIcon size={14} /> بياناتك مستخدمة فقط لتوصيل طلبك</div>
      </form>
    </div>
  );
}
