import { readDB } from "@/lib/db";
import { Header, Footer } from "@/components/Shop";
import MyOrders from "@/components/MyOrders";
export default function Page() {
  return (<><Header /><div className="wrap"><MyOrders currency={readDB().settings.currency} /></div><Footer /></>);
}
