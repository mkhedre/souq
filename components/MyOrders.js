"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { STATUS } from "@/lib/status";
import { getMyOrders, fetchStatuses, setSeen } from "./track";
export default function MyOrders({ currency }) {
  const [list, setList] = useState(null); const [perm, setPerm] = useState("default");
  const [tokens, setTokens] = useState({});
  async function load() { try { const l = await fetchStatuses(); l.forEach((s) => setSeen(s.id, s.status)); setList(l); const t = {}; getMyOrders().forEach((o) => (t[o.id] = o.token)); setTokens(t); } catch { setList([]); } }
  useEffect(() => { load(); if (window.Notification) setPerm(Notification.permission); const t = setInterval(load, 20000); window.addEventListener("orders-updated", load); return () => { clearInterval(t); window.removeEventListener("orders-updated", load); }; }, []);
  const fmt = (d) => new Date(d).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" });
  if (!list) return null;
  return (<div className="panel" style={{ maxWidth: 680, margin: "32px auto" }}>
    <h2 style={{ marginTop: 0 }}>طلباتي</h2>
    {perm === "default" && window.Notification && <button className="btn sm" onClick={async () => setPerm(await Notification.requestPermission())}>فعّل إشعارات المتصفح</button>}
    {perm === "denied" && <p style={{ color: "var(--m)", fontSize: 13 }}>إشعارات المتصفح مرفوضة. هتظهرلك التحديثات هنا وفي أعلى الصفحة.</p>}
    <p style={{ color: "var(--m)", fontSize: 13 }}>الطلبات المعروضة هي اللي اتعملت من هذا المتصفح. التحديث تلقائي كل ٢٠ ثانية وإنت فاتح الموقع.</p>
    {!list.length && <p>لا توجد طلبات على هذا الجهاز. <Link href="/">ابدأ التسوّق</Link></p>}
    {list.map((o) => (<div className="row" key={o.id} style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
      <div className="grow"><b>طلب #{o.id}</b> <span className={`pill ${o.status}`}>{STATUS[o.status]}</span>
        <div style={{ fontSize: 12, color: "var(--m)", marginTop: 4 }}>{o.history.map((h) => `${STATUS[h.status]} (${fmt(h.at)})`).join(" ← ")}</div></div>
      <b>{o.total.toLocaleString("ar-EG")} {currency}</b>
      <Link className="btn sm o" href={`/order/${o.id}?t=${tokens[o.id]}`}>{o.status === "delivered" ? "التفاصيل والتقييم" : "التفاصيل"}</Link>
    </div>))}
  </div>);
}
