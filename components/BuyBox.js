"use client";
import { useState } from "react";
import AddBtn from "./AddBtn";
export default function BuyBox({ id, name, price, currency }) {
  const [qty, setQty] = useState(1);
  const n = (v) => v.toLocaleString("ar-EG");
  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));
  return (
    <>
      <div className="buyrow">
        <div className="qty big"><button type="button" onClick={dec} aria-label="تقليل">−</button><b>{n(qty)}</b><button type="button" onClick={inc} aria-label="زيادة">+</button></div>
        <div className="total"><span>الإجمالي</span><b>{n(price * qty)} {currency}</b></div>
      </div>
      <AddBtn id={id} qty={qty} name={name} big label="أضف إلى السلة" />
      <div className="stickyatc">
        <div className="p"><b>{n(price * qty)} {currency}</b><span>{qty > 1 ? `${n(qty)} قطع` : name}</span></div>
        <div className="qty"><button type="button" onClick={dec}>−</button><b>{n(qty)}</b><button type="button" onClick={inc}>+</button></div>
        <div style={{ flex: 1 }}><AddBtn id={id} qty={qty} name={name} label="أضف للسلة" /></div>
      </div>
    </>
  );
}
