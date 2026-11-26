"use client";
import { useState } from "react";
import { addToCart } from "./cart";
import { CartIcon } from "./Icons";
export default function AddBtn({ id, qty = 1, name = "", label = "أضف للسلة", big = false }) {
  const [done, setDone] = useState(false);
  return (
    <button className={`btn${big ? " big" : ""}`} style={{ width: "100%" }}
      onClick={() => {
        addToCart(id, qty);
        window.dispatchEvent(new CustomEvent("cart-toast", { detail: { name, qty } }));
        setDone(true); setTimeout(() => setDone(false), 1400);
      }}>
      <CartIcon size={17} /> {done ? "✓ تمت الإضافة" : label}
    </button>
  );
}
