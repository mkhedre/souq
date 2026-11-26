import { readDB } from "@/lib/db";
import { Header, Footer } from "@/components/Shop";
import { CartIcon } from "@/components/Icons";
import CartView from "@/components/CartView";
export default function CartPage() {
  const db = readDB();
  return (<><Header /><div className="wrap">
    <div className="sec"><span className="bar" /><h2 style={{ display: "flex", alignItems: "center", gap: 10 }}><CartIcon size={24} /> سلة المشتريات</h2></div>
    <CartView products={db.products.filter((p) => p.active)} settings={db.settings} /></div><Footer /></>);
}
