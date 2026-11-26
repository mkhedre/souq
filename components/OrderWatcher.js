"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { STATUS } from "@/lib/status";
import { getMyOrders, fetchStatuses, setSeen } from "./track";
export default function OrderWatcher() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    let stop = false;
    async function check() {
      if (!getMyOrders().length) return;
      let list = []; try { list = await fetchStatuses(); } catch { return; }
      if (stop) return;
      const mine = getMyOrders();
      for (const s of list) {
        const m = mine.find((o) => o.id === s.id);
        if (m && m.seen && m.seen !== s.status) {
          setSeen(s.id, s.status);
          const text = `طلبك رقم #${s.id}: ${STATUS[s.status]}`;
          setMsg({ id: s.id, text, token: m.token });
          try { if (window.Notification && Notification.permission === "granted") new Notification("تحديث على طلبك", { body: text }); } catch {}
          window.dispatchEvent(new Event("orders-updated"));
          break;
        }
      }
    }
    check(); const t = setInterval(check, 20000);
    const v = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", v);
    return () => { stop = true; clearInterval(t); document.removeEventListener("visibilitychange", v); };
  }, []);
  if (!msg) return null;
  return (
    <div className="toast rise" style={{ insetInlineStart: "auto", insetInlineEnd: 22 }}>
      <span className="tick">!</span>
      <div className="grow"><b>تحديث على طلبك</b><span>{msg.text}</span></div>
      <Link href={`/order/${msg.id}?t=${msg.token}`} className="btn sm o" onClick={() => setMsg(null)}>عرض</Link>
      <button className="btn sm o" onClick={() => setMsg(null)}>×</button>
    </div>
  );
}
