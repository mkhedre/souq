import { readDB } from "@/lib/db";
import { Header, Footer, ProductCard, Stars, fmt } from "@/components/Shop";
import Tile from "@/components/Tile";
import BuyBox from "@/components/BuyBox";
import { TruckIcon, CashIcon, ReturnIcon, CheckIcon } from "@/components/Icons";
import Link from "next/link";
import { notFound } from "next/navigation";
export default async function ProductPage({ params }) {
  const { id } = await params;
  const db = readDB(); const s = db.settings;
  const p = db.products.find((x) => String(x.id) === id && x.active);
  if (!p) notFound();
  const cat = db.categories.find((c) => c.id === p.category);
  const rel = db.products.filter((x) => x.active && x.category === p.category && x.id !== p.id).slice(0, 4);
  const off = p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const freeAt = Number(s.freeDeliveryFrom);
  return (
    <>
      <Header />
      <div className="wrap">
        <nav className="crumbs"><Link href="/">الرئيسية</Link><span>‹</span>{cat && <><Link href={`/?cat=${cat.id}`}>{cat.name}</Link><span>‹</span></>}<b>{p.name}</b></nav>
        <div className="panel pdp">
          <div className="pimg">
            {off > 0 && <span className="badge">خصم {off.toLocaleString("ar-EG")}٪</span>}
            <Tile name={p.name} image={p.image} />
          </div>
          <div className="pinfo">
            <h1>{p.name}</h1>
            <Stars rating={p.rating} reviews={p.reviews} />
            <div className="price" style={{ fontSize: 34 }}>{fmt(p.price, s.currency)}{off > 0 && <span className="old">{fmt(p.oldPrice, s.currency)}</span>}</div>
            {off > 0 && <div className="save">وفّر {fmt(p.oldPrice - p.price, s.currency)} ({off.toLocaleString("ar-EG")}٪)</div>}
            <p className="desc">{p.description}</p>
            <div className="perks">
              <span><CheckIcon size={16} /> {p.stock > 0 ? `متوفر (${p.stock.toLocaleString("ar-EG")} قطعة)` : "نفد المخزون"}</span>
              <span><TruckIcon size={16} /> التوصيل في نفس اليوم</span>
              <span><CashIcon size={16} /> الدفع كاش عند الاستلام</span>
              <span><ReturnIcon size={16} /> استرجاع مجاني لو المنتج غير مطابق</span>
            </div>
            {p.stock > 0 && <BuyBox id={p.id} name={p.name} price={p.price} currency={s.currency} />}
            <div className="freeship">{p.price >= freeAt ? "هذا المنتج مؤهل للتوصيل المجاني" : `توصيل مجاني للطلبات فوق ${freeAt.toLocaleString("ar-EG")} ${s.currency}`}</div>
          </div>
        </div>
        {rel.length > 0 && <>
          <div className="sec"><span className="bar" /><h2>منتجات مشابهة</h2></div>
          <div className="grid">{rel.map((r) => <ProductCard key={r.id} p={r} cur={s.currency} />)}</div>
        </>}
      </div>
      <Footer />
    </>
  );
}
