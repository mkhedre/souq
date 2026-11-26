"use client";
export const getCart = () => { try { return JSON.parse(localStorage.getItem("cart") || "{}"); } catch { return {}; } };
export const setCart = (c) => { localStorage.setItem("cart", JSON.stringify(c)); window.dispatchEvent(new Event("cart")); };
export const addToCart = (id, n = 1) => { const c = getCart(); c[id] = (c[id] || 0) + n; setCart(c); };
