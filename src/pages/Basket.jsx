import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatDA } from "@/lib/format";
import { Image } from "@/components/ui/image";
import BrandButton from "@/components/common/BrandButton";
import { priceLabel } from "@/lib/order";

export default function Basket() {
  const { items, subtotal, setQuantity, removeItem } = useCart();

  useEffect(() => {
    document.title = "Your basket · Nora Nailshop";
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-28 text-center">
        <img
          src="/assets/logos/circular-logo.png"
          alt=""
          aria-hidden="true"
          className="mx-auto h-20 w-20 object-contain opacity-80"
        />
        <h1 className="mt-6 font-heading text-[2.2rem] font-light leading-tight text-brand-blue">
          Your basket is waiting for something beautiful.
        </h1>
        <p className="mt-4 font-body text-sm text-brand-blue/60">
          Explore the collection and keep the sets you love in one place.
        </p>
        <BrandButton to="/shop" className="mt-8">
          Explore collection
        </BrandButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-14 sm:px-8 lg:py-20">
      <p className="eyebrow text-brand-blue/50">Your bag</p>
      <h1 className="mt-3 font-heading text-[2.4rem] font-light text-brand-blue sm:text-[3rem]">
        Almost <span className="serif-italic">yours</span>
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div>
          <ul className="divide-y divide-brand-gold/20 border-y border-brand-gold/25">
            {items.map((line) => (
              <li key={line.lineId} className="flex gap-4 py-5">
                <div className="h-28 w-24 shrink-0 overflow-hidden bg-white">
                  {line.image ? (
                    <Image src={line.image} alt={line.name} className="h-full w-full" fittingType="fill" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-lavender/20 font-heading text-xs italic text-brand-blue/50">
                      Custom
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-heading text-lg text-brand-blue">{line.name}</p>
                      <p className="mt-1 font-body text-[0.7rem] uppercase tracking-[0.12em] text-brand-blue/50">
                        {[line.shape, line.size].filter(Boolean).join(" · ") || "Made to measure"}
                      </p>
                      {line.sizeNote && (
                        <p className="mt-1 font-body text-xs text-brand-blue/55">{line.sizeNote}</p>
                      )}
                      {line.customizationText && (
                        <p className="mt-1 max-w-md font-body text-xs leading-relaxed text-brand-blue/55">
                          {line.customizationText}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.lineId)}
                      aria-label={`Remove ${line.name}`}
                      className="text-brand-blue/40 transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-brand-gold/40 bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="flex h-10 w-10 items-center justify-center text-brand-blue"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-body text-sm text-brand-blue">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                        aria-label="Increase quantity"
                        className="flex h-10 w-10 items-center justify-center text-brand-blue"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-sm text-brand-blue">
                        {priceLabel(line)} {line.priceOnRequest ? "" : `× ${line.quantity}`}
                      </p>
                      <p className="font-heading text-lg text-brand-blue">
                        {line.priceOnRequest || !Number(line.unitPrice)
                          ? "On request"
                          : formatDA(line.unitPrice * line.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 font-body text-[0.65rem] uppercase tracking-[0.18em] text-brand-blue/70 hover:text-brand-blue"
          >
            Continue shopping <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <aside className="h-fit bg-white p-6 sm:p-8">
          <p className="eyebrow text-brand-gold">Order summary</p>
          <div className="mt-5 space-y-2 font-body text-sm text-brand-blue/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatDA(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-brand-blue/55">To be confirmed</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-brand-gold/25 pt-4">
            <span className="eyebrow text-brand-blue/60">Total</span>
            <span className="font-heading text-2xl text-brand-blue">{formatDA(subtotal)}</span>
          </div>
          <p className="mt-3 font-body text-xs leading-relaxed text-brand-blue/55">
            Delivery fee will be confirmed after order submission.
          </p>
          <Link
            to="/checkout"
            className="mt-6 flex min-h-[52px] items-center justify-center bg-brand-blue font-body text-[0.7rem] uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-ink"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}