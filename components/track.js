"use client";
export const getMyOrders = () => { try { return JSON.parse(localStorage.getItem("myorders") || "[]"); } catch { return []; } };
export const saveMyOrder = (id, token, status) => {
  if (!id || !token) return;
  const l = getMyOrders().filter((o) => o.id !== id);
  l.unshift({ id, token, seen: status }); localStorage.setItem("myorders", JSON.stringify(l.slice(0, 30)));
};
export const setSeen = (id, status) => { const l = getMyOrders().map((o) => (o.id === id ? { ...o, seen: status } : o)); localStorage.setItem("myorders", JSON.stringify(l)); };
export async function fetchStatuses() {
  const l = getMyOrders(); if (!l.length) return [];
  const r = await fetch("/api/orders/status?o=" + l.map((o) => `${o.id}.${o.token}`).join(","), { cache: "no-store" });
  return r.ok ? r.json() : [];
}
