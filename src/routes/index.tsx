import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, ShoppingBag, MessageCircle, Star, Battery, Headphones, Waves, ShieldCheck, Zap, Clock, Package, Send } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { PRODUCTS, useStore, waLink, type Category, type Product } from "@/lib/store";
import { CartDrawer, CheckoutModal, ProductModal, btnPrimary, btnWa } from "@/components/aura/Overlays";
import hero from "@/assets/headphones.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AURA — Redefine Your Tech Lifestyle" },
      { name: "description", content: "Luxury headphones, smartwatches, earbuds and wireless chargers. Shop AURA or order instantly via WhatsApp." },
      { property: "og:title", content: "AURA — Redefine Your Tech Lifestyle" },
      { property: "og:description", content: "Luxury DTC tech & lifestyle. Order instantly via WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Catalog />
      <WhatsAppShowcase />
      <About />
      <Footer />
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <a href={waLink("Hi AURA! I have a question.")} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
        className="pulse-ring fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg isolate">
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

function Navbar() {
  const { count, setOpen, currency, setCurrency } = useStore();
  const links = [["Store", "#store"], ["Featured", "#featured"], ["Categories", "#store"], ["About", "#about"], ["Contact", "#contact"]];
  return (
    <header className="sticky top-0 z-30 glass border-x-0 border-t-0">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <a href="#" className="font-display text-2xl font-bold tracking-[0.3em] text-gradient">AURA</a>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          {links.map(([l, h]) => <a key={l} href={h} className="transition hover:text-primary">{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <button aria-label="Search" className="rounded-full p-2 hover:text-primary" onClick={() => document.getElementById("store")?.scrollIntoView()}><Search className="h-5 w-5" /></button>
          <div className="flex rounded-full glass p-1 text-xs">
            {(["USD", "PKR"] as const).map((c) => (
              <button key={c} onClick={() => setCurrency(c)} className={`rounded-full px-3 py-1 transition ${currency === c ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>{c}</button>
            ))}
          </div>
          <button aria-label="Cart" onClick={() => setOpen(true)} className="relative rounded-full p-2 hover:text-primary">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span key={count} className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-primary px-1 text-[10px] font-bold text-primary-foreground animate-scale-in">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { setActive, fmt } = useStore();
  const p = PRODUCTS[0]!;
  const badges = [
    { icon: Waves, t: "Active Noise Cancellation", c: "left-0 top-10" },
    { icon: Battery, t: "40h Battery", c: "right-0 top-1/3" },
    { icon: Headphones, t: "Spatial Audio", c: "bottom-10 left-6" },
  ];
  return (
    <section id="featured" className="relative bg-hero">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2">
        <div className="animate-fade-in">
          <p className="mb-4 inline-flex rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">New · AURA Max</p>
          <h1 className="text-5xl font-bold leading-[1.02] md:text-7xl">Redefine Your <span className="text-gradient">Tech Lifestyle</span></h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Precision-engineered audio and wearables, crafted for those who notice the details. From {fmt(79)}.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#store" className={btnPrimary}>Explore Collection</a>
            <a href={waLink(`Hi AURA! I'd like to quick-buy ${p.name} (${fmt(p.price)}).`)} target="_blank" rel="noreferrer" className={btnWa}><MessageCircle className="h-4 w-4" /> Quick Buy via WhatsApp</a>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-lg">
          <div className="absolute inset-8 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
          <button onClick={() => setActive(p)} className="float relative block h-full w-full overflow-hidden rounded-[2.5rem] glass glow-hover">
            <img src={hero} alt="AURA Max headphones" width={1024} height={1024} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
          </button>
          {badges.map(({ icon: I, t, c }) => (
            <div key={t} className={`absolute ${c} hidden items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium glow sm:flex`}><I className="h-4 w-4 text-primary" />{t}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Catalog() {
  const [cat, setCat] = useState<"All" | Category>("All");
  const [max, setMax] = useState(500);
  const { fmt } = useStore();
  const list = useMemo(() => PRODUCTS.filter((p) => (cat === "All" || p.category === cat) && p.price <= max), [cat, max]);
  return (
    <section id="store" className="mx-auto max-w-7xl px-5 py-20">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">The Collection</p>
          <h2 className="mt-2 text-4xl font-bold md:text-5xl">Engineered to impress</h2>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl glass p-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {(["All", "Audio", "Wearables", "Power"] as const).map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm transition ${cat === c ? "bg-gradient-primary text-primary-foreground glow" : "text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </div>
          <div className="flex min-w-52 items-center gap-3 text-sm">
            <span className="text-muted-foreground">Up to</span>
            <Slider value={[max]} min={50} max={500} step={10} onValueChange={(v) => setMax(v[0] ?? 500)} className="flex-1" />
            <span className="w-20 text-right font-semibold">{fmt(max)}</span>
          </div>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {list.length === 0 && <p className="py-16 text-center text-muted-foreground">No products match these filters.</p>}
    </section>
  );
}

function ProductCard({ p }: { p: Product }) {
  const { add, fmt, setActive } = useStore();
  const [color, setColor] = useState(p.colors[0]!);
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl glass glow-hover animate-fade-in">
      <button onClick={() => setActive(p)} className="relative aspect-square overflow-hidden bg-card">
        <img src={p.images[0]} alt={p.name} loading="lazy" width={1024} height={1024} style={{ filter: color.filter }} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:opacity-0" />
        <img src={p.images[1]} alt="" loading="lazy" style={{ filter: color.filter }} className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100" />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs font-semibold"><Star className="h-3 w-3 fill-primary text-primary" />{p.rating}</span>
      </button>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold">{p.name}</h3>
            <p className="truncate text-xs text-muted-foreground">{p.tagline}</p>
          </div>
          <p className="shrink-0 font-display font-bold">{fmt(p.price)}</p>
        </div>
        <div className="flex gap-2">
          {p.colors.map((c) => (
            <button key={c.name} aria-label={c.name} title={c.name} onClick={() => setColor(c)} style={{ background: c.swatch }} className={`h-6 w-6 rounded-full border-2 transition ${c.name === color.name ? "scale-110 border-primary" : "border-border"}`} />
          ))}
        </div>
        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2">
          <button className={`${btnPrimary} px-4 py-2.5`} onClick={() => { add(p, color); toast.success(`${p.name} · ${color.name} added`); }}>Add to Cart</button>
          <a aria-label="Order via WhatsApp" href={waLink(`Hi AURA! I'd like to order ${p.name} (${color.name}) — ${fmt(p.price)}.`)} target="_blank" rel="noreferrer" className={`${btnWa} px-3 py-2.5`}><MessageCircle className="h-4 w-4" /></a>
        </div>
      </div>
    </article>
  );
}

function WhatsAppShowcase() {
  const feats = [
    { icon: MessageCircle, t: "Instant Concierge", d: "Chat with a product specialist in seconds." },
    { icon: Package, t: "Live Order Tracking", d: "Get shipping updates right in your chat." },
    { icon: Zap, t: "Custom Orders", d: "Bundles, engraving and bulk — just message us." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] glass p-8 md:p-14">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-whatsapp opacity-20 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-whatsapp">WhatsApp API</p>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">WhatsApp Instant Ordering & Concierge</h2>
            <p className="mt-4 text-muted-foreground">Skip the forms. Every product, cart and checkout on AURA can be sent straight to our team on WhatsApp — pre-filled and ready to confirm.</p>
            <a href={waLink("Hi AURA concierge!")} target="_blank" rel="noreferrer" className={`${btnWa} mt-8`}><MessageCircle className="h-4 w-4" /> Start a chat</a>
          </div>
          <div className="grid gap-4">
            {feats.map(({ icon: I, t, d }) => (
              <div key={t} className="flex gap-4 rounded-2xl glass p-5 glow-hover">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-whatsapp/15 text-whatsapp"><I className="h-5 w-5" /></div>
                <div><p className="font-semibold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-5 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">About AURA</p>
      <h2 className="mt-2 text-3xl font-bold md:text-4xl">Designed in silence. Built to be felt.</h2>
      <p className="mt-4 text-muted-foreground">We sell direct, cut the middlemen, and pour everything into materials, sound and craft — delivered to your door.</p>
    </section>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const cols = { Shop: ["Audio", "Wearables", "Power", "New Arrivals"], Support: ["Shipping", "Returns", "Warranty", "FAQ"], Company: ["About", "Careers", "Press", "Contact"] };
  const trust = [{ i: ShieldCheck, t: "Secure Checkout" }, { i: Zap, t: "Fast Delivery" }, { i: Clock, t: "24/7 WhatsApp Support" }];
  return (
    <footer id="contact" className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-2xl font-bold tracking-[0.3em] text-gradient">AURA</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">Luxury tech & lifestyle, direct to you. hello@aura.store · +92 300 0000000</p>
          <form className="mt-6 flex max-w-sm gap-2" onSubmit={(e) => { e.preventDefault(); toast.success("You're on the list! Welcome to AURA."); setEmail(""); }}>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="min-w-0 flex-1 rounded-full border border-input bg-muted/50 px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <button aria-label="Subscribe" className={`${btnPrimary} px-4 py-2.5`}><Send className="h-4 w-4" /></button>
          </form>
        </div>
        {Object.entries(cols).map(([h, ls]) => (
          <div key={h}>
            <p className="mb-4 font-semibold">{h}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">{ls.map((l) => <li key={l}><a href="#store" className="hover:text-primary">{l}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border px-5 py-6 text-xs text-muted-foreground md:flex-row">
        <div className="flex flex-wrap justify-center gap-3">
          {trust.map(({ i: I, t }) => <span key={t} className="flex items-center gap-2 rounded-full glass px-3 py-1.5"><I className="h-3.5 w-3.5 text-primary" />{t}</span>)}
        </div>
        <p>© {new Date().getFullYear()} AURA. All rights reserved.</p>
      </div>
    </footer>
  );
}

