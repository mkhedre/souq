import fs from "fs";
import path from "path";
const DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const FILE = path.join(DIR, "db.json");

const cats = [
  { id: "veg", name: "خضار وفاكهة", image: "/categories/veg.jpg" },
  { id: "dairy", name: "ألبان وجبن", image: "/categories/dairy.jpg" },
  { id: "meat", name: "لحوم ودواجن", image: "/categories/meat.jpg" },
  { id: "bakery", name: "مخبوزات", image: "/categories/bakery.jpg" },
  { id: "drinks", name: "مشروبات", image: "/categories/drinks.jpg" },
  { id: "pantry", name: "بقالة", image: "/categories/pantry.jpg" },
  { id: "clean", name: "منظفات", image: "/categories/clean.jpg" },
  { id: "snacks", name: "سناكس وحلويات", image: "/categories/snacks.jpg" },
];
const P = (id, name, cat, price, old, icon, stock, rating, desc) => ({
  id, name, category: cat, price, oldPrice: old, icon, stock, rating: 0, reviews: 0,
  description: desc, image: `/products/p${String(id).padStart(2, "0")}.jpg`, active: true, featured: id % 3 === 0,
});
function seed() {
  return {
    settings: { storeName: "سوق ماركت", tagline: "كل احتياجات بيتك من السوبر ماركت لحد باب البيت", color: "#0f9d58", currency: "ج.م", deliveryFee: 25, freeDeliveryFrom: 300, phone: "01000000000", banner: "خصم 20% على الخضار والفاكهة الطازجة اليوم" },
    categories: cats,
    products: [
      P(1, "طماطم طازجة 1 كجم", "veg", 18, 24, "🍅", 120, 4.5, "طماطم طازجة من المزرعة مباشرة."),
      P(2, "موز 1 كجم", "veg", 35, 0, "🍌", 80, 4.7, "موز ناضج حلو المذاق."),
      P(3, "تفاح أحمر 1 كجم", "veg", 60, 72, "🍎", 60, 4.4, "تفاح أحمر مقرمش."),
      P(4, "لبن كامل الدسم 1 لتر", "dairy", 42, 0, "🥛", 200, 4.6, "لبن طازج معقم."),
      P(5, "جبنة رومي 500 جم", "dairy", 130, 150, "🧀", 40, 4.3, "جبنة رومي قديمة."),
      P(6, "زبادي طبيعي 105 جم", "dairy", 9, 0, "🍶", 300, 4.5, "زبادي طبيعي كامل الدسم."),
      P(7, "صدور دجاج 1 كجم", "meat", 150, 170, "🍗", 50, 4.6, "صدور دجاج طازجة مفرزة."),
      P(8, "لحمة مفرومة 1 كجم", "meat", 320, 0, "🥩", 30, 4.4, "لحمة بقري مفرومة طازجة."),
      P(9, "عيش بلدي 10 أرغفة", "bakery", 10, 0, "🍞", 500, 4.8, "عيش بلدي طازج."),
      P(10, "كرواسون سادة", "bakery", 15, 0, "🥐", 70, 4.2, "كرواسون بالزبدة."),
      P(11, "مياه معدنية 1.5 لتر × 6", "drinks", 54, 60, "💧", 150, 4.5, "عبوة 6 زجاجات مياه."),
      P(12, "عصير برتقال 1 لتر", "drinks", 38, 0, "🧃", 90, 4.3, "عصير برتقال طبيعي."),
      P(13, "شاي أسود 100 ظرف", "drinks", 95, 110, "🫖", 100, 4.7, "شاي أسود فاخر."),
      P(14, "أرز مصري 1 كجم", "pantry", 32, 0, "🍚", 250, 4.6, "أرز أبيض مصري."),
      P(15, "زيت عباد الشمس 1 لتر", "pantry", 85, 95, "🫒", 120, 4.5, "زيت طهي صحي."),
      P(16, "مكرونة 400 جم", "pantry", 14, 0, "🍝", 400, 4.4, "مكرونة قصيرة."),
      P(17, "سكر 1 كجم", "pantry", 30, 0, "🍬", 300, 4.3, "سكر أبيض ناعم."),
      P(18, "سائل غسيل أطباق 750 مل", "clean", 45, 52, "🧴", 110, 4.4, "يزيل الدهون بسهولة."),
      P(19, "مسحوق غسيل 3 كجم", "clean", 150, 0, "🧺", 70, 4.5, "مسحوق غسيل أوتوماتيك."),
      P(20, "شيبسي كبير", "snacks", 12, 0, "🥔", 600, 4.2, "شيبسي مقرمش."),
      P(21, "شوكولاتة ألواح", "snacks", 20, 25, "🍫", 220, 4.6, "شوكولاتة بالحليب."),
      P(22, "بسكويت بالتمر", "snacks", 8, 0, "🍪", 350, 4.1, "بسكويت بالتمر."),
    ],
    orders: [],
    serviceRating: { sum: 0, count: 0 },
    nextOrderId: 1001,
  };
}
export function readDB() {
  if (!fs.existsSync(FILE)) { fs.mkdirSync(DIR, { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(seed(), null, 2)); }
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}
export function writeDB(db) {
  fs.mkdirSync(DIR, { recursive: true });
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, FILE);
}
export function update(fn) { const db = readDB(); const r = fn(db); writeDB(db); return r; }
