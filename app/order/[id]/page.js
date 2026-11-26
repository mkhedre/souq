import { readDB } from "@/lib/db";
import { Header, Footer } from "@/components/Shop";
import { CheckIcon } from "@/components/Icons";
import { STATUS } from "@/lib/status";
import { waLink } from "@/lib/whatsapp";
import OrderLive from "@/components/OrderLive";
import RateOrder from "@/components/RateOrder";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function OrderPage({ params, searchParams }) {
  const { id } = await params; const { t } = await searchParams; const db = readDB();
  const o = db.orders.find((x) => String(x.id) === id); if (!o || !o.token || o.token !== t) notFound();
  return (<><Header /><div className="wrap"><div className="panel rise" style={{ maxWidth: 640, margin: "32px auto" }}>
    <div className="done-ic"><CheckIcon size={36} /></div>
    <h2 style={{ margin: "0 0 6px" }}>تم استلام طلبك رقم #{o.id}</h2>
    <p style={{ margin: "0 0 14px", color: "var(--m)" }}>الحالة: <span className={`pill ${o.status}`}>{STATUS[o.status]}</span></p>
    <OrderLive id={o.id} token={o.token} status={o.status} />
    {o.status === "delivered" && <RateOrder id={o.id} token={o.token} items={o.items.map((i) => ({ id: i.id, name: i.name }))} initial={o.rating || null} />}
    {(o.history || []).length > 1 && <p style={{ fontSize: 13, color: "var(--m)" }}>{o.history.map((h) => `${STATUS[h.status]} (${new Date(h.at).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })})`).join(" ← ")}</p>}
    <p style={{ color: "var(--m)" }}>سنتواصل معك على <b style={{ color: "var(--t)" }}>{o.phone}</b> لتأكيد التوصيل إلى: {o.address}</p>
    {waLink(o, db.settings) && <a className="btn" href={waLink(o, db.settings)} style={{ display: "inline-flex", marginBottom: 12 }}>إرسال الطلب على واتساب مرة أخرى</a>}
    {o.items.map((i) => <div className="row" key={i.id}><span className="grow">{i.name} × {i.qty}</span><b>{(i.price * i.qty).toLocaleString("ar-EG")}</b></div>)}
    <div className="row"><span className="grow">التوصيل</span><b>{o.deliveryFee.toLocaleString("ar-EG")}</b></div>
    <div className="row"><b className="grow">الإجمالي</b><b style={{ fontSize: 20, color: "var(--cd)" }}>{o.total.toLocaleString("ar-EG")} {db.settings.currency}</b></div>
  </div></div><Footer /></>);
}
