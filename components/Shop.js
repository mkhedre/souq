import Link from "next/link";
import { readDB } from "@/lib/db";
import CartBadge from "./CartBadge";
import ToastHost from "./Toast";
import OrderWatcher from "./OrderWatcher";
import Tile, { Dot } from "./Tile";
import { StoreIcon, CartIcon, SearchIcon, TruckIcon, CashIcon, ShieldIcon, ReturnIcon, PhoneIcon, StarIcon } from "./Icons";
import AddBtn from "./AddBtn";
export const fmt = (n, cur) => `${Number(n).toLocaleString("ar-EG")} ${cur}`;

export function Header({ q = "", cat = "" }) {
  const db = readDB(); const s = db.settings;
  return (
    <>
      {s.banner && <div className="promo">{s.banner}</div>}
      <div className="topbar"><div className="wrap">
        <span><TruckIcon size={15} /> توصيل مجاني للطلبات فوق {Number(s.freeDeliveryFrom).toLocaleString("ar-EG")} {s.currency}</span>
        <a href={`tel:${s.phone}`}><PhoneIcon size={14} /> {s.phone}</a>
      </div></div>
      <header className="hdr">
        <div className="top"><div className="wrap">
          <Link href="/" className="logo"><span className="mark"><StoreIcon size={22} /></span><span><em>{String(s.storeName).split(" ")[0]}</em> {String(s.storeName).split(" ").slice(1).join(" ")}</span></Link>
          <form className="search" action="/" method="get">
            <input name="q" defaultValue={q} placeholder="ابحث عن منتج..." />
            <button><SearchIcon size={17} /> بحث</button>
          </form>
          <Link href="/cart" className="cartlink"><CartIcon size={19} /> السلة <CartBadge /></Link>
          <Link href="/my-orders" className="cartlink">طلباتي</Link>
        </div></div>
        <nav className="sub"><div className="wrap">
          <Link href="/" className={!cat ? "on" : ""}>كل المنتجات</Link>
          {db.categories.map((c) => <Link key={c.id} href={`/?cat=${c.id}`} className={cat === c.id ? "on" : ""}><Dot seed={c.name} /> {c.name}</Link>)}
        </div></nav>
      </header>
      <ToastHost />
      <OrderWatcher />
    </>
  );
}

export function Footer() {
  const db = readDB(); const s = db.settings;
  return (
    <footer className="foot">
      <div className="trust wrap">
        <div className="ti"><TruckIcon size={22} /><div><b>توصيل سريع</b><span>في نفس اليوم</span></div></div>
        <div className="ti"><CashIcon size={22} /><div><b>الدفع عند الاستلام</b><span>كاش عند باب البيت</span></div></div>
        <div className="ti"><ReturnIcon size={22} /><div><b>استرجاع مجاني</b><span>لو المنتج مش مطابق</span></div></div>
        <div className="ti"><ShieldIcon size={22} /><div><b>جودة مضمونة</b><span>منتجات طازجة 100%</span></div></div>
      </div>
      <div className="wrap">
        <div className="cols">
          <div>
            <div className="flogo"><span className="mark" style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,var(--c),var(--cd))", display: "grid", placeItems: "center" }}><StoreIcon size={20} /></span> {s.storeName}</div>
            <p>{s.tagline}. نوصل طلباتك لحد باب البيت بسرعة وأمان، والدفع عند الاستلام.</p>
          </div>
          <div>
            <h4>الأقسام</h4>
            {db.categories.slice(0, 6).map((c) => <Link key={c.id} href={`/?cat=${c.id}`}>{c.name}</Link>)}
          </div>
          <div>
            <h4>تواصل معنا</h4>
            <p>للطلب والاستفسار: <b style={{ color: "#fff" }}>{s.phone}</b></p>
            <p>توصيل مجاني للطلبات فوق {Number(s.freeDeliveryFrom).toLocaleString("ar-EG")} {s.currency}</p>
          </div>
        </div>
        <div className="bar">© {s.storeName} — كل الحقوق محفوظة</div>
      </div>
    </footer>
  );
}

export function Stars({ rating, reviews }) {
  return (
    <span className="stars2">
      {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} size={14} style={{ color: i <= Math.round(rating) ? "#f59e0b" : "#d7dce3" }} />)}
      {reviews != null && (Number(reviews) > 0 ? <small>({Number(reviews).toLocaleString("ar-EG")})</small> : <small>لا تقييمات بعد</small>)}
    </span>
  );
}

export function ProductCard({ p, cur }) {
  const off = p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <div className="card rise">
      {off > 0 && <span className="badge">خصم {off.toLocaleString("ar-EG")}٪</span>}
      {p.stock > 0 && p.stock <= 20 && <span className="stocklow">باقي {p.stock.toLocaleString("ar-EG")} فقط</span>}
      <Link href={`/product/${p.id}`}>
        <div className="img"><Tile name={p.name} image={p.image} /></div>
        <h3>{p.name}</h3>
      </Link>
      <Stars rating={p.rating} reviews={p.reviews} />
      <div className="price">{fmt(p.price, cur)}{off > 0 && <span className="old">{fmt(p.oldPrice, cur)}</span>}</div>
      <div style={{ marginTop: "auto" }}>{p.stock > 0 ? <AddBtn id={p.id} name={p.name} /> : <button className="btn" disabled style={{ width: "100%" }}>نفد المخزون</button>}</div>
    </div>
  );
}
