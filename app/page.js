import { readDB } from "@/lib/db";
import { Header, Footer, ProductCard } from "@/components/Shop";
import Carousel from "@/components/Carousel";
import { TruckIcon, CashIcon, ShieldIcon, TagIcon } from "@/components/Icons";
import Link from "next/link";
export default async function Home({ searchParams }) {
  const { q = "", cat = "", sort = "" } = await searchParams;
  const db = readDB(); const s = db.settings;
  let list = db.products.filter((p) => p.active);
  if (cat) list = list.filter((p) => p.category === cat);
  if (q) list = list.filter((p) => p.name.includes(q) || p.description.includes(q));
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);
  const featured = db.products.filter((p) => p.active && p.featured).slice(0, 5);
  const offers = db.products.filter((p) => p.active && p.oldPrice > p.price).slice(0, 10);
  const browsing = q || cat;
  const curCat = db.categories.find((c) => c.id === cat);
  return (
    <>
      <Header q={q} cat={cat} />
      <div className="wrap">
        {!browsing && <div className="hero2 rise">
          <div className="ov" />
          <div className="hc">
            <span className="kick"><TagIcon size={15} /> عروض يومية على الطازج</span>
            <h1>{s.storeName}</h1>
            <p>{s.tagline}</p>
            <div className="hrow">
              <a href="#shop" className="cta">تسوّق الآن</a>
              <a href="#offers" className="cta2">عروض اليوم</a>
            </div>
          </div>
        </div>}
        {!browsing && <div className="feat">
          <div className="f rise"><span className="fic" style={{ background: "linear-gradient(135deg,#10b981,#065f46)" }}><TruckIcon /></span><div><b>توصيل سريع</b><span>لحد باب البيت في نفس اليوم</span></div></div>
          <div className="f rise"><span className="fic" style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}><CashIcon /></span><div><b>الدفع عند الاستلام</b><span>ادفع كاش لما يوصلك طلبك</span></div></div>
          <div className="f rise"><span className="fic" style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)" }}><ShieldIcon /></span><div><b>جودة مضمونة</b><span>منتجات طازجة أو استرجاع فوري</span></div></div>
        </div>}
        {!browsing && <>
          <div className="sec"><span className="bar" /><h2>تسوّق حسب القسم</h2></div>
          <div className="cats">{db.categories.map((c) => <Link key={c.id} href={`/?cat=${c.id}`} className="cat"><span className="cimg">{c.image ? <img src={c.image} alt={c.name} loading="lazy" /> : null}</span><div className="n">{c.name}</div></Link>)}</div>
        </>}
        {!browsing && offers.length > 0 && <>
          <div className="sec" id="offers"><span className="bar" style={{ background: "linear-gradient(#ef4444,#b91c1c)" }} /><h2>عروض اليوم <small>خصومات حقيقية لفترة محدودة</small></h2></div>
          <Carousel>{offers.map((p) => <ProductCard key={p.id} p={p} cur={s.currency} />)}</Carousel>
        </>}
        {!browsing && featured.length > 0 && <>
          <div className="sec"><span className="bar" /><h2>منتجات مميزة</h2></div>
          <div className="grid">{featured.map((p) => <ProductCard key={p.id} p={p} cur={s.currency} />)}</div>
        </>}
        <div className="sec" id="shop"><span className="bar" />
          <h2>{curCat ? curCat.name : q ? `نتائج البحث عن "${q}"` : "كل المنتجات"} <small>({list.length.toLocaleString("ar-EG")} منتج)</small></h2>
        </div>
        <form style={{ maxWidth: 230, marginBottom: 14, display: "flex", gap: 8 }}>
          {q && <input type="hidden" name="q" value={q} />}{cat && <input type="hidden" name="cat" value={cat} />}
          <select name="sort" defaultValue={sort}><option value="">الترتيب: الافتراضي</option><option value="low">السعر: الأقل أولًا</option><option value="high">السعر: الأعلى أولًا</option></select>
          <button className="btn sm o">تطبيق</button>
        </form>
        {list.length ? <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} cur={s.currency} />)}</div> : <div className="panel">لا توجد منتجات مطابقة.</div>}
      </div>
      <Footer />
    </>
  );
}
