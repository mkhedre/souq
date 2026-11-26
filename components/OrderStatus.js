"use client";
import { useRouter } from "next/navigation";
import { STATUS } from "@/lib/status";
import { waNumber } from "@/lib/whatsapp";
export default function OrderStatus({ id, status, phone, store }) {
  const r = useRouter();
  const num = waNumber(phone);
  const wa = num && `https://wa.me/${num}?text=${encodeURIComponent(`${store || "المتجر"}: طلبك رقم #${id} - ${STATUS[status]}`)}`;
  return <><select value={status} style={{ width: 130 }} onChange={async (e) => { await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: e.target.value }) }); r.refresh(); }}>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>{wa && <a className="btn sm o" style={{ marginInlineStart: 6 }} target="_blank" href={wa}>إبلاغ العميل واتساب</a>}</>;
}
