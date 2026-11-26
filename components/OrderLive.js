"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveMyOrder } from "./track";
export default function OrderLive({ id, token, status }) {
  const r = useRouter();
  useEffect(() => {
    saveMyOrder(id, token, status);
    const t = setInterval(async () => {
      try { const l = await (await fetch(`/api/orders/status?o=${id}.${token}`, { cache: "no-store" })).json(); if (l[0] && l[0].status !== status) r.refresh(); } catch {}
    }, 15000);
    return () => clearInterval(t);
  }, [id, token, status]);
  return null;
}
