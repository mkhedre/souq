import { readDB } from "@/lib/db";
import { STATUS } from "@/lib/status";
import { ChartIcon, WalletIcon, OrdersIcon, BellIcon, BoxIcon, UsersIcon, StarIcon } from "@/components/Icons";
import Tile from "@/components/Tile";
import Link from "next/link";
const GRADS = {
  green: "linear-gradient(135deg,#10b981,#065f46)", blue: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
  amber: "linear-gradient(135deg,#f59e0b,#b45309)", violet: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  red: "linear-gradient(135deg,#ef4444,#b91c1c)",
};
export default function Dash() {
  const db = readDB(); const cur = db.settings.currency; const n = (v) => v.toLocaleString("ar-EG");
  const valid = db.orders.filter((o) => o.status !== "cancelled");
  const revenue = valid.reduce((a, o) => a + o.total, 0);
  const low = db.products.filter((p) => p.stock <= 20);
  const sr = db.serviceRating || { sum: 0, count: 0 };
  const days = [...Array(7)].map((_, i) => { const d = new Date(Date.now() - (6 - i) * 864e5); const k = d.toISOString().slice(0, 10); return { k: d.toLocaleDateString("ar-EG", { weekday: "short" }), v: valid.filter((o) => o.createdAt.slice(0, 10) === k).reduce((a, o) => a + o.total, 0) }; });
  const max = Math.max(1, ...days.map((d) => d.v));
  const cards = [
    { label: "إجمالي المبيعات", val: `${n(revenue)} ${cur}`, icon: <WalletIcon />, g: GRADS.green },
    { label: "عدد الطلبات", val: n(db.orders.length), icon: <OrdersIcon />, g: GRADS.blue },
    { label: "طلبات جديدة", val: n(db.orders.filter((o) => o.status === "new").length), icon: <BellIcon />, g: GRADS.amber },
    { label: "المنتجات", val: n(db.products.length), icon: <BoxIcon />, g: GRADS.violet },
    { label: "مخزون منخفض", val: n(low.length), icon: <UsersIcon />, g: GRADS.red },
    { label: "تقييم الخدمة", val: sr.count ? `${(sr.sum / sr.count).toLocaleString("ar-EG", { maximumFractionDigits: 1 })} / ٥ (${n(sr.count)})` : "لا تقييمات بعد", icon: <StarIcon />, g: GRADS.amber },
  ];
  return (<><h1><ChartIcon /> لوحة التحكم</h1>
    <div className="stats">
      {cards.map((c) => <div className="stat" key={c.label}><div className="shead"><span>{c.label}</span><span className="sic" style={{ background: c.g }}>{c.icon}</span></div><b>{c.val}</b></div>)}
    </div>
    <div className="panel"><b>مبيعات آخر ٧ أيام</b><div className="bars" style={{ marginBottom: 28 }}>{days.map((d, i) => <div key={i} style={{ height: `${(d.v / max) * 100}%` }} title={n(d.v)}><span>{d.k}</span></div>)}</div></div>
    <div className="cols"><div><h3>آخر الطلبات</h3><table><thead><tr><th>#</th><th>العميل</th><th>الإجمالي</th><th>الحالة</th></tr></thead><tbody>
      {db.orders.slice(0, 6).map((o) => <tr key={o.id}><td>{o.id}</td><td>{o.name}</td><td>{n(o.total)}</td><td><span className={`pill ${o.status}`}>{STATUS[o.status]}</span></td></tr>)}
      {!db.orders.length && <tr><td colSpan={4}>لا توجد طلبات بعد</td></tr>}</tbody></table><p><Link href="/admin/orders" style={{ color: "var(--c)", fontWeight: 700 }}>كل الطلبات ←</Link></p></div>
      <div><h3>تنبيه المخزون</h3><table><tbody>{low.slice(0, 6).map((p) => <tr key={p.id}><td style={{ display: "flex", alignItems: "center", gap: 10 }}><Tile name={p.name} image={p.image} className="sm" style={{ width: 34, height: 34, fontSize: 15, borderRadius: 9, flex: "none" }} /> {p.name}</td><td>{n(p.stock)}</td></tr>)}{!low.length && <tr><td>لا يوجد</td></tr>}</tbody></table></div></div></>);
}
