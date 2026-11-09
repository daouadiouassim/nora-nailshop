import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Image } from "@/components/ui/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem, subtotal, count } = useCart();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div
        className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-brand-cream shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-brand-gold/25 px-6 py-5">
          <div>
            <p className="eyebrow text-brand-blue/50">Your bag</p>
            <p className="font-heading text-2xl text-brand-blue">
              {count === 0 ? "Empty" : `${count} piece${count === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag"
            className="inline-flex h-11 w-11 items-center justify-center text-brand-blue"
          >
            <X className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag className="mb-5 h-8 w-8 text-brand-gold" strokeWidth={1.2} />
            <p className="font-heading text-2xl leading-snug text-brand-blue">
              Your basket is waiting for something beautiful.
            </p>
            <Link
              to="/shop"
              onClick={closeCart}
              className="mt-7 inline-flex min-h-[48px] items-center justify-center bg-brand-blue px-7 font-body text-[0.7rem] uppercase tracking-[0.18em] text-white"
            >
              Explore collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ul className="space-y-5">
                {items.map((line) => (
                  <li key={line.lineId} className="flex gap-4 border-b border-brand-gold/15 pb-5">
                    <div className="h-24 w-20 shrink-0 overflow-hidden bg-white">
                      {line.image ? (
                        <Image
                          src={line.image}
                          alt={line.name}
                          className="h-full w-full"
                          fittingType="fill"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-brand-lavender/20 px-1 text-center font-heading text-xs italic text-brand-blue/50">
                          Custom
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-heading text-lg leading-tight text-brand-blue">{line.name}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(line.lineId)}
                          aria-label={`Remove ${line.name}`}
                          className="mt-0.5 text-brand-blue/40 transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                        </button>
                      </div>
                      <p className="mt-1 font-body text-[0.72rem] uppercase tracking-[0.12em] text-brand-blue/55">
                        {[line.shape, line.size].filter(Boolean).join(" · ")}
                      </p>
                      {line.customization?.notes && (
                        <p className="mt-1 line-clamp-2 font-body text-xs text-brand-blue/50">
                          {line.customization.notes}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-brand-gold/40">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-9 w-9 items-center justify-center text-brand-blue"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center font-body text-sm text-brand-blue">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                            aria-label="Increase quantity"
                            className="flex h-9 w-9 items-center justify-center text-brand-blue"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className={cn("font-body text-sm text-brand-blue")}>
                          {line.priceOnRequest || !Number(line.unitPrice)
                            ? "On request"
                            : `${(line.unitPrice * line.quantity).toLocaleString("fr-FR")} DA`}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-brand-gold/25 px-6 py-5">
              <div className="flex items-center justify-between font-body text-sm text-brand-blue">
                <span className="eyebrow text-brand-blue/60">Subtotal</span>
                <span className="font-heading text-xl">{subtotal.toLocaleString("fr-FR")} DA</span>
              </div>
              <p className="mt-1 font-body text-xs text-brand-blue/50">
                Delivery fee confirmed after your order is received.
              </p>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="mt-5 flex min-h-[52px] items-center justify-center bg-brand-blue font-body text-[0.7rem] uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-ink"
              >
                Proceed to checkout
              </Link>
              <Link
                to="/basket"
                onClick={closeCart}
                className="mt-3 flex min-h-[48px] items-center justify-center border border-brand-blue/30 font-body text-[0.7rem] uppercase tracking-[0.18em] text-brand-blue transition-colors hover:border-brand-gold"
              >
                View full basket
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}