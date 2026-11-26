// Normalize an Egyptian/international number to digits for wa.me (e.g. 01012345678 -> 201012345678)
export function waNumber(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = "20" + d.slice(1);
  return d.length >= 8 ? d : "";
}
export function orderText(o, s) {
  const n = (v) => Number(v).toLocaleString("en-US");
  const lines = [`طلب جديد من ${s.storeName || "المتجر"} - رقم #${o.id}`, ""];
  o.items.forEach((i, k) => lines.push(`${k + 1}. ${i.name} × ${i.qty} = ${n(i.price * i.qty)} ${s.currency}`));
  lines.push("", `المجموع: ${n(o.subtotal)} ${s.currency}`, `التوصيل: ${o.deliveryFee ? n(o.deliveryFee) + " " + s.currency : "مجاني"}`, `الإجمالي: ${n(o.total)} ${s.currency}`, "(الدفع عند الاستلام)", "", `الاسم: ${o.name}`, `الموبايل: ${o.phone}`, `العنوان: ${o.address}`);
  if (o.notes) lines.push(`ملاحظات: ${o.notes}`);
  return lines.join("\n");
}
export function waLink(o, s) {
  const num = waNumber(s.whatsapp);
  if (!num) return "";
  return `https://wa.me/${num}?text=${encodeURIComponent(orderText(o, s))}`;
}
