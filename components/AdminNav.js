"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartIcon, OrdersIcon, BoxIcon, GearIcon, StoreIcon, ReportIcon } from "./Icons";
export default function AdminNav() {
  const path = usePathname();
  const items = [
    { href: "/admin", label: "الرئيسية", icon: <ChartIcon />, exact: true },
    { href: "/admin/orders", label: "الطلبات", icon: <OrdersIcon /> },
    { href: "/admin/reports", label: "التقارير", icon: <ReportIcon /> },
    { href: "/admin/products", label: "المنتجات", icon: <BoxIcon /> },
    { href: "/admin/settings", label: "الإعدادات", icon: <GearIcon /> },
  ];
  return (
    <nav>
      {items.map((i) => {
        const on = i.exact ? path === i.href : path.startsWith(i.href);
        return <Link key={i.href} href={i.href} className={on ? "on" : ""}>{i.icon} {i.label}</Link>;
      })}
      <Link href="/" target="_blank"><StoreIcon /> عرض المتجر</Link>
    </nav>
  );
}
