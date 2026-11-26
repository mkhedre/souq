"use client";
import { LogoutIcon } from "./Icons";
export default function Logout() { return <a href="#" onClick={async (e) => { e.preventDefault(); await fetch("/api/admin/login", { method: "DELETE" }); location.href = "/admin/login"; }} style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", borderRadius: 12, fontSize: 14.5, fontWeight: 600 }}><LogoutIcon /> تسجيل الخروج</a>; }
