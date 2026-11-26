"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function ToastHost() {
  const [t, setT] = useState(null);
  useEffect(() => {
    let timer;
    const on = (e) => { setT(e.detail); clearTimeout(timer); timer = setTimeout(() => setT(null), 3500); };
    window.addEventListener("cart-toast", on);
    return () => { window.removeEventListener("cart-toast", on); clearTimeout(timer); };
  }, []);
  if (!t) return null;
  return (
    <div className="toast rise">
      <span className="tick">✓</span>
      <div className="grow">
        <b>تمت الإضافة إلى السلة</b>
        <span>{t.qty > 1 ? `${t.qty.toLocaleString("ar-EG")} × ` : ""}{t.name}</span>
      </div>
      <Link href="/cart" className="btn sm o" onClick={() => setT(null)}>عرض السلة</Link>
    </div>
  );
}
