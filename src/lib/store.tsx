import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import headphones from "@/assets/headphones.jpg";
import watch from "@/assets/watch.jpg";
import charger from "@/assets/charger.jpg";
import earbuds from "@/assets/earbuds.jpg";

export const WHATSAPP_NUMBER = "923000000000";
export const FREE_SHIPPING = 250;
export const TAX_RATE = 0.08;
export const PKR_RATE = 280;

export type Category = "Audio" | "Wearables" | "Power";
export type ColorOpt = { name: string; swatch: string; filter: string };

export const COLORS: ColorOpt[] = [
  { name: "Matte Black", swatch: "oklch(0.2 0 0)", filter: "none" },
  { name: "Cyber Silver", swatch: "oklch(0.85 0.01 250)", filter: "grayscale(1) brightness(1.35)" },
  { name: "Deep Slate", swatch: "oklch(0.5 0.12 280)", filter: "hue-rotate(60deg) saturate(1.4)" },
];

export type Product = {
  id: string; name: string; tagline: string; category: Category; price: number;
  rating: number; images: string[]; colors: ColorOpt[];
};

export const PRODUCTS: Product[] = [
  { id: "aura-max", name: "AURA Max", tagline: "Flagship ANC over-ear headphones", category: "Audio", price: 449, rating: 4.9, images: [headphones, earbuds, charger], colors: COLORS },
  { id: "aura-pods", name: "AURA Pods Pro", tagline: "Spatial audio earbuds", category: "Audio", price: 229, rating: 4.8, images: [earbuds, headphones, charger], colors: COLORS },
  { id: "aura-chrono", name: "AURA Chrono", tagline: "Titanium smartwatch", category: "Wearables", price: 399, rating: 4.9, images: [watch, charger, earbuds], colors: COLORS },
  { id: "aura-pulse", name: "AURA Pulse", tagline: "Fitness wearable, 14-day battery", category: "Wearables", price: 249, rating: 4.7, images: [watch, earbuds, charger], colors: COLORS.slice(0, 2) },
  { id: "aura-halo", name: "AURA Halo", tagline: "15W minimalist wireless charger", category: "Power", price: 79, rating: 4.8, images: [charger, watch, earbuds], colors: COLORS },
  { id: "aura-dock", name: "AURA Dock Trio", tagline: "3-in-1 charging station", category: "Power", price: 149, rating: 4.9, images: [charger, headphones, watch], colors: COLORS.slice(1) },
  { id: "aura-studio", name: "AURA Studio", tagline: "Wired-lossless studio headphones", category: "Audio", price: 329, rating: 4.6, images: [headphones, watch, earbuds], colors: COLORS.slice(0, 2) },
  { id: "aura-buds", name: "AURA Buds Air", tagline: "Featherweight everyday earbuds", category: "Audio", price: 129, rating: 4.7, images: [earbuds, charger, headphones], colors: COLORS },
];

export type CartItem = { key: string; product: Product; color: ColorOpt; qty: number };
type Currency = "USD" | "PKR";

type Ctx = {
  items: CartItem[]; add: (p: Product, c: ColorOpt, q?: number) => void;
  setQty: (key: string, q: number) => void; remove: (key: string) => void; clear: () => void;
  count: number; subtotal: number; open: boolean; setOpen: (o: boolean) => void;
  currency: Currency; setCurrency: (c: Currency) => void; fmt: (usd: number) => string;
  active: Product | null; setActive: (p: Product | null) => void;
  checkout: boolean; setCheckout: (o: boolean) => void;
};
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [active, setActive] = useState<Product | null>(null);
  const [checkout, setCheckout] = useState(false);

  const value = useMemo<Ctx>(() => ({
    items, open, setOpen, currency, setCurrency, active, setActive, checkout, setCheckout,
    add: (product, color, qty = 1) => setItems((prev) => {
      const key = `${product.id}-${color.name}`;
      const ex = prev.find((i) => i.key === key);
      return ex ? prev.map((i) => i.key === key ? { ...i, qty: i.qty + qty } : i) : [...prev, { key, product, color, qty }];
    }),
    setQty: (key, q) => setItems((p) => q <= 0 ? p.filter((i) => i.key !== key) : p.map((i) => i.key === key ? { ...i, qty: q } : i)),
    remove: (key) => setItems((p) => p.filter((i) => i.key !== key)),
    clear: () => setItems([]),
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal: items.reduce((s, i) => s + i.qty * i.product.price, 0),
    fmt: (usd) => currency === "USD"
      ? `$${usd.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
      : `Rs ${Math.round(usd * PKR_RATE).toLocaleString("en-US")}`,
  }), [items, open, currency, active, checkout]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : 15;
}
