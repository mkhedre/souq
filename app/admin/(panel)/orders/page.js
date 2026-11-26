import { readDB } from "@/lib/db";
import OrderStatus from "@/components/OrderStatus";
import { OrdersIcon } from "@/components/Icons";
export default function Orders() {
  const db = readDB(); const n = (v) => v.toLocaleString("ar-EG");
  return (<><h1><OrdersIcon /> الطلبات</h1><table><thead><tr><th>#</th><th>العميل</th><th>الموبايل / العنوان</th><th>المنتجات</th><th>الإجمالي</th><th>الحالة</th></tr></thead><tbody>
    {db.orders.map((o) => <tr key={o.id}><td>{o.id}</td><td>{o.name}</td><td>{o.phone}<br /><small style={{ color: "var(--m)" }}>{o.address}</small></td><td>{o.items.map((i) => `${i.name}×${i.qty}`).join("، ")}</td><td>{n(o.total)} {db.settings.currency}</td><td><OrderStatus id={o.id} status={o.status} phone={o.phone} store={db.settings.storeName} /></td></tr>)}
    {!db.orders.length && <tr><td colSpan={6}>لا توجد طلبات بعد</td></tr>}</tbody></table></>);
}
