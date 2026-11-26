"use client";
import { useEffect, useRef, useState } from "react";

export default function Carousel({ children }) {
  const ref = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft); // RTL: scrollLeft is negative in most browsers
    setAtStart(pos < 4);
    setAtEnd(max <= 0 || max - pos < 4);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector(":scope > *");
    const step = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  const chevron = (d) => (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
  );

  return (
    <div className="cwrap">
      <button type="button" className="cnav cprev" onClick={() => scroll(1)} disabled={atStart} aria-label="السابق">{chevron("m9 6 6 6-6 6")}</button>
      <div className="offrow" ref={ref}>{children}</div>
      <button type="button" className="cnav cnext" onClick={() => scroll(-1)} disabled={atEnd} aria-label="التالي">{chevron("m15 6-6 6 6 6")}</button>
    </div>
  );
}
