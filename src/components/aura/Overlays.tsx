import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, X, Check, CreditCard, Truck, MessageCircle, Star } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FREE_SHIPPING, TAX_RATE, shippingFor, useStore, waLink, type ColorOpt } from "@/lib/store";

export const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:glow hover:scale-[1.02] active:scale-95 disabled:opacity-50";
export const btnWa = "inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-whatsapp-foreground transition hover:brightness-110 hover:scale-[1.02] active:scale-95";
export const btnGhost = "inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold transition glow-hover";

function Qty({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full glass">
      <button aria-label="Decrease" className="p-2 hover:text-primary" onClick={() => onChange(value - 1)}><Minus className="h-4 w-4" /></button>
      <span className="w-8 text-center text-sm font-semibold">{value}</span>
      <button aria-label="Increase" className="p-2 hover:text-primary" onClick={() => onChange(value + 1)}><Plus className="h-4 w-4" /></button>
    </div>
  );
}

export function ProductModal() {
  const { active, setActive, add, fmt, setOpen } = useStore();
  const [img, setImg] = useState(0);
  const [color, setColor] = useState<ColorOpt | null>(null);
  const [qty, setQty] = useState(1);
  useEffect(() => { setImg(0); setQty(1); setColor(active?.colors[0] ?? null); }, [active]);
  if (!active || !color) return <Sheet open={false} />;
  const total = active.price * qty;
  const msg = `Hi AURA! I'd like to order:\n• ${active.name} (${color.name}) x${qty}\nTotal: ${fmt(total)}\nPlease confirm availability.`;
  return (
    <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
      <SheetContent side="right" className="w-full overflow-y-auto border-l border-border bg-background p-0 sm:max-w-xl">
        <div className="relative aspect-square overflow-hidden bg-card">
          <img src={active.images[img]} alt={active.name} width={1024} height={1024} style={{ filter: color.filter }} className="h-full w-full object-cover transition duration-500 animate-fade-in" key={img + color.name} />
        </div>
        <div className="flex gap-3 px-6 pt-4">
          {active.images.map((s, i) => (
            <button key={i} onClick={() => setImg(i)} className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${i === img ? "border-primary glow" : "border-transparent opacity-60 hover:opacity-100"}`}>
              <img src={s} alt="" className="h-full w-full object-cover" style={{ filter: color.filter }} />
            </button>
          ))}
        </div>
        <div className="space-y-6 p-6">
          <SheetHeader className="p-0 text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">{active.category}</p>
            <SheetTitle className="font-display text-3xl">{active.name}</SheetTitle>
            <p className="text-muted-foreground">{active.tagline}</p>
            <p className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-primary text-primary" /> {active.rating} · 2,140 reviews</p>
          </SheetHeader>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">Color: <span className="text-foreground">{color.name}</span></p>
            <div className="flex gap-3">
              {active.colors.map((c) => (
                <button key={c.name} aria-label={c.name} onClick={() => setColor(c)} style={{ background: c.swatch }} className={`h-9 w-9 rounded-full border-2 transition ${c.name === color.name ? "border-primary glow scale-110" : "border-border"}`} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Qty value={qty} onChange={(n) => setQty(Math.max(1, n))} />
            <p className="font-display text-3xl font-bold">{fmt(total)}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button className={btnPrimary} onClick={() => { add(active, color, qty); toast.success(`${active.name} added to cart`); setActive(null); setOpen(true); }}>Add to Cart</button>
            <a className={btnWa} href={waLink(msg)} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> Order on WhatsApp</a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, fmt, setCheckout } = useStore();
  const ship = shippingFor(subtotal);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + ship + tax;
  const left = Math.max(0, FREE_SHIPPING - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
  const msg = `Hi AURA! I'd like to place this order:\n${items.map((i) => `• ${i.product.name} (${i.color.name}) x${i.qty} — ${fmt(i.qty * i.product.price)}`).join("\n")}\n\nSubtotal: ${fmt(subtotal)}\nShipping: ${ship ? fmt(ship) : "Free"}\nTax: ${fmt(tax)}\nTotal: ${fmt(total)}`;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col border-l border-border bg-background sm:max-w-md">
        <SheetHeader><SheetTitle className="font-display text-2xl">Your Cart</SheetTitle></SheetHeader>
        <div className="rounded-2xl glass p-4">
          <p className="mb-2 text-sm">{left > 0 ? <>Add <span className="font-semibold text-primary">{fmt(left)}</span> more for Free Express Shipping!</> : <span className="text-primary">You've unlocked Free Express Shipping</span>}</p>
          <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gradient-primary transition-all duration-500" style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="-mx-2 flex-1 space-y-3 overflow-y-auto px-2">
          {items.length === 0 && <p className="py-16 text-center text-muted-foreground">Your cart is empty.</p>}
          {items.map((i) => (
            <div key={i.key} className="flex gap-3 rounded-2xl glass p-3 animate-fade-in">
              <img src={i.product.images[0]} alt="" style={{ filter: i.color.filter }} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <p className="truncate font-semibold">{i.product.name}</p>
                  <button aria-label="Remove" onClick={() => remove(i.key)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
                <p className="text-xs text-muted-foreground">{i.color.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Qty value={i.qty} onChange={(n) => setQty(i.key, n)} />
                  <p className="font-semibold">{fmt(i.qty * i.product.price)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <Row l="Subtotal" r={fmt(subtotal)} />
            <Row l="Shipping" r={ship ? fmt(ship) : "Free"} />
            <Row l="Tax (8%)" r={fmt(tax)} />
            <div className="flex justify-between pt-2 font-display text-xl font-bold"><span>Total</span><span>{fmt(total)}</span></div>
            <div className="grid gap-2 pt-3">
              <button className={btnPrimary} onClick={() => { setOpen(false); setCheckout(true); }}><CreditCard className="h-4 w-4" /> Checkout</button>
              <a className={btnWa} href={waLink(msg)} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> Checkout via WhatsApp</a>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

const Row = ({ l, r }: { l: string; r: string }) => <div className="flex justify-between text-muted-foreground"><span>{l}</span><span className="text-foreground">{r}</span></div>;

export function CheckoutModal() {
  const { checkout, setCheckout, subtotal, fmt, clear } = useStore();
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [total, setTotal] = useState(0);
  useEffect(() => { if (checkout) { setStep(0); setTotal(subtotal + shippingFor(subtotal) + subtotal * TAX_RATE); } }, [checkout]);
  const steps = ["Shipping", "Payment", "Confirmed"];
  const input = "w-full rounded-xl border border-input bg-muted/50 px-4 py-3 text-sm outline-none focus:border-primary";
  return (
    <Dialog open={checkout} onOpenChange={setCheckout}>
      <DialogContent className="border-border bg-background sm:max-w-lg">
        <DialogTitle className="font-display text-2xl">Checkout</DialogTitle>
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${i <= step ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i < step ? <Check className="h-4 w-4" /> : i + 1}</span>
              <span className="text-xs">{s}</span>
              {i < 2 && <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
        {step === 0 && (
          <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
            <input required className={input} placeholder="Full name" />
            <input required type="email" className={input} placeholder="Email" />
            <input required className={input} placeholder="Address" />
            <div className="grid grid-cols-2 gap-3"><input required className={input} placeholder="City" /><input required className={input} placeholder="Phone" /></div>
            <button className={btnPrimary}><Truck className="h-4 w-4" /> Continue to Payment</button>
          </form>
        )}
        {step === 1 && (
          <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); setProcessing(true); setTimeout(() => { setProcessing(false); setStep(2); clear(); }, 1200); }}>
            <input required className={input} placeholder="Card number (demo)" defaultValue="4242 4242 4242 4242" />
            <div className="grid grid-cols-2 gap-3"><input required className={input} placeholder="MM/YY" defaultValue="12/29" /><input required className={input} placeholder="CVC" defaultValue="123" /></div>
            <p className="text-xs text-muted-foreground">This is a payment simulation — no card is charged.</p>
            <button disabled={processing} className={btnPrimary}>{processing ? "Processing…" : `Pay ${fmt(total)}`}</button>
          </form>
        )}
        {step === 2 && (
          <div className="py-6 text-center animate-scale-in">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-primary glow"><Check className="h-8 w-8 text-primary-foreground" /></div>
            <h3 className="text-2xl font-bold">Order Confirmed</h3>
            <p className="mt-2 text-muted-foreground">Order #AURA-{Math.floor(100000 + Math.random() * 900000)} · {fmt(total)}</p>
            <button className={`${btnGhost} mt-6`} onClick={() => setCheckout(false)}><X className="h-4 w-4" /> Close</button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
