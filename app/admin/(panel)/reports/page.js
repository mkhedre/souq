import { readDB } from "@/lib/db";
import { STATUS } from "@/lib/status";
import { ReportIcon, WalletIcon, OrdersIcon, BellIcon, TagIcon } from "@/components/Icons";
export const dynamic = "force-dynamic";

const GRADS = {
  green: "linear-gradient(135deg,#10b981,#065f46)", blue: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
  amber: "linear-gradient(135deg,#f59e0b,#b45309)", violet: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  red: "linear-gradient(135deg,#ef4444,#b91c1c)",
};
const LATE_HOURS = 3;
const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo" });
const timeFmt = new Intl.DateTimeFormat("ar-EG", { timeZone: "Africa/Cairo", hour: "numeric", minute: "2-digit" });

export default async function Reports({ searchParams }) {
  const { day } = await searchParams;
  const today = dayFmt.format(new Date());
  const sel = /^\d{4}-\d{2}-\d{2}$/.test(String(day || "")) ? day : today;
  const db = readDB(); const cur = db.settings.currency; const n = (v) => v.toLocaleString("ar-EG");
  const orders = db.orders.filter((o) => dayFmt.format(new Date(o.createdAt)) === sel);
  const valid = orders.filter((o) => o.status !== "cancelled");
  const cancelled = orders.filter((o) => o.status === "cancelled");
  const sales = valid.reduce((a, o) => a + o.total, 0);
  const now = Date.now();
  const late = orders.filter((o) => !["delivered", "cancelled"].includes(o.status) && now - new Date(o.createdAt).getTime() > LATE_HOURS * 36e5);
  const qty = new Map();
  valid.forEach((o) => o.items.forEach((i) => qty.set(i.name, (qty.get(i.name) || 0) + i.qty)));
  const top = [...qty.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxQ = Math.max(1, ...top.map((t) => t[1]));
  const cards = [
    { label: "مبيعات اليوم", val: `${n(sales)} ${cur}`, icon: <WalletIcon />, g: GRADS.green },
    { label: "عدد الطلبات", val: n(orders.length), icon: <OrdersIcon />, g: GRADS.blue },
    { label: "طلبات ملغية", val: n(cancelled.length), icon: <BellIcon />, g: GRADS.red },
    { label: `متأخرة (+${LATE_HOURS} ساعات)`, val: n(late.length), icon: <TagIcon />, g: GRADS.amber },
  ];
  return (<><h1><ReportIcon /> تقرير المبيعات</h1>
    <form className="repform" method="get" action="/admin/reports">
      <input type="date" name="day" defaultValue={sel} max={today} />
      <button className="btn sm">عرض اليوم</button>
      {sel !== today && <a className="btn sm o" href="/admin/reports">اليوم الحالي</a>}
      <span className="repsum">طلبات يوم {new Date(sel + "T12:00:00").toLocaleDateString("ar-EG", { timeZone: "Africa/Cairo", weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
    </form>
    <div className="stats">
      {cards.map((c) => <div className="stat" key={c.label}><div className="shead"><span>{c.label}</span><span className="sic" style={{ background: c.g }}>{c.icon}</span></div><b>{c.val}</b></div>)}
    </div>
    <div className="panel">
      <b>أكثر المنتجات مبيعاً</b>
      {!top.length && <p style={{ color: "var(--m)", margin: "10px 0 0" }}>لا توجد مبيعات في هذا اليوم.</p>}
      {top.map(([name, q]) => <div className="tprod" key={name}>
        <span className="tpn">{name}</span>
        <span className="tpb"><i style={{ width: `${(q / maxQ) * 100}%` }} /></span>
        <span className="tpq">{n(q)}</span>
      </div>)}
    </div>
    <h3 style={{ margin: "18px 0 10px" }}>طلبات اليوم</h3>
    <table><thead><tr><th>#</th><th>الوقت</th><th>العميل</th><th>الموبايل</th><th>المنتجات</th><th>الإجمالي</th><th>الحالة</th></tr></thead><tbody>
      {orders.map((o) => <tr key={o.id}>
        <td>{o.id}</td>
        <td>{timeFmt.format(new Date(o.createdAt))}</td>
        <td>{o.name}</td>
        <td><a href={`tel:${o.phone}`}>{o.phone}</a></td>
        <td>{o.items.map((i) => `${i.name}×${i.qty}`).join("، ")}</td>
        <td>{n(o.total)} {cur}</td>
        <td><span className={`pill ${o.status}`}>{STATUS[o.status]}</span></td>
      </tr>)}
      {!orders.length && <tr><td colSpan={7}>لا توجد طلبات في هذا اليوم</td></tr>}
    </tbody></table>
    <p style={{ color: "var(--m)", fontSize: 13, marginTop: 10 }}>المبيعات لا تشمل الطلبات الملغية. "متأخرة" تعني طلباً مر عليه أكثر من {LATE_HOURS} ساعات ولم يُسلَّم أو يُلغَ.</p>
  </>);
}
