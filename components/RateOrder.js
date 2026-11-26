"use client";
import { useState } from "react";
import { StarIcon, CheckIcon } from "./Icons";

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="rate-stars" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" aria-label={`${i} نجوم`} onMouseEnter={() => setHover(i)} onClick={() => onChange(i)}>
          <StarIcon size={26} style={{ color: i <= (hover || value) ? "#f59e0b" : "#d7dce3" }} />
        </button>
      ))}
    </span>
  );
}

export default function RateOrder({ id, token, items, initial }) {
  const [stars, setStars] = useState(() => { const m = {}; (items || []).forEach((i) => (m[i.id] = 0)); return m; });
  const [service, setService] = useState(0);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  if (initial) {
    return (
      <div className="ratebox">
        <div className="done-ic sm"><CheckIcon size={20} /></div>
        <b>شكراً! تم تسجيل تقييمك لهذا الطلب.</b>
        <div className="row" style={{ border: 0, paddingBottom: 0 }}><span className="grow">تقييمك للخدمة</span>
          <span className="stars2">{[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} size={16} style={{ color: i <= initial.service ? "#f59e0b" : "#d7dce3" }} />)}</span></div>
      </div>
    );
  }
  const allRated = (items || []).every((i) => stars[i.id] > 0);
  async function submit() {
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/ratings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, token, service, items: items.map((i) => ({ id: i.id, stars: stars[i.id] })) }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(d.error || "حصل خطأ، حاول مرة أخرى"); setBusy(false); return; }
      setDone(true);
    } catch { setErr("حصل خطأ في الاتصال، حاول مرة أخرى"); setBusy(false); }
  }
  if (done) {
    return (
      <div className="ratebox">
        <div className="done-ic sm"><CheckIcon size={20} /></div>
        <b>شكراً! وصلنا تقييمك.</b>
        <p style={{ margin: "6px 0 0", color: "var(--m)", fontSize: 13 }}>تقييمك بيساعدنا نحسّن الخدمة والمنتجات.</p>
      </div>
    );
  }
  return (
    <div className="ratebox">
      <b style={{ fontSize: 16 }}>قيّم طلبك</b>
      <p style={{ margin: "4px 0 8px", color: "var(--m)", fontSize: 13 }}>طلبك وصل. قيّم المنتجات والخدمة من ١ إلى ٥ نجوم.</p>
      {(items || []).map((i) => (
        <div className="rrow" key={i.id}>
          <span className="grow">{i.name}</span>
          <StarPicker value={stars[i.id]} onChange={(v) => setStars((s) => ({ ...s, [i.id]: v }))} />
        </div>
      ))}
      <div className="rrow">
        <span className="grow"><b>الخدمة (التوصيل والتعامل)</b></span>
        <StarPicker value={service} onChange={setService} />
      </div>
      {err && <p style={{ color: "#b91c1c", fontSize: 13, margin: "8px 0 0" }}>{err}</p>}
      <button className="btn" style={{ marginTop: 12 }} disabled={busy || !allRated || !service} onClick={submit}>
        {busy ? "جارٍ الإرسال..." : "إرسال التقييم"}
      </button>
    </div>
  );
}
