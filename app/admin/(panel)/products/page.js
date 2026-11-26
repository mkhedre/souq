import { readDB } from "@/lib/db";
import ProductsManager from "@/components/ProductsManager";
import { BoxIcon } from "@/components/Icons";
export default function Products() { const db = readDB(); return (<><h1><BoxIcon /> المنتجات</h1><ProductsManager products={db.products} categories={db.categories} currency={db.settings.currency} /></>); }
