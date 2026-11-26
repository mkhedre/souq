import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readDB } from "@/lib/db";
import AdminNav from "@/components/AdminNav";
import Logout from "@/components/Logout";
import { StoreIcon } from "@/components/Icons";
export default async function PanelLayout({ children }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const s = readDB().settings;
  return (<div className="adm"><aside className="side">
    <div className="logo"><span className="mark" style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg,var(--c),var(--cd))", display: "grid", placeItems: "center" }}><StoreIcon size={18} /></span><span><em>{s.storeName}</em></span></div>
    <AdminNav />
    <Logout /></aside><main className="main">{children}</main></div>);
}
