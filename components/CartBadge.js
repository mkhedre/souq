"use client";
import { useEffect, useState } from "react";
import { getCart } from "./cart";
export default function CartBadge() {
  const [n, setN] = useState(0);
  useEffect(() => { const f = () => setN(Object.values(getCart()).reduce((a, b) => a + b, 0)); f(); window.addEventListener("cart", f); return () => window.removeEventListener("cart", f); }, []);
  return <span className="cbadge">{n.toLocaleString("ar-EG")}</span>;
}
