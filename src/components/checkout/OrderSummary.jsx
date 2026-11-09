import { formatDA } from "@/lib/format";

export default function OrderSummary({ lines, subtotal, deliveryFee, deliveryNote, compact = false }) {
  const feeKnown = deliveryFee !== null && deliveryFee !== undefined;
  const total = subtotal + (feeKnown ? Number(deliveryFee) : 0);

  return (
    <aside className="bg-white p-6 sm:p-8">
      <p className="eyebrow text-brand-gold">Order summary</p>
      <h2 className="mt-2 font-heading text-2xl text-brand-blue">Your selection</h2>

      <ul className="mt-6 space-y-4">
        {lines.map((line) => (
          <li key={line.lineId} className="flex gap-3 border-b border-brand-gold/15 pb-4">
            {!compact && line.image && (
              <div className="h-16 w-14 shrink-0 overflow-hidden bg-brand-cream">
                <img src={line.image} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="font-heading text-base leading-tight text-brand-blue">
                  {line.name}
                  {line.quantity > 1 && (
                    <span className="ml-1 font-body text-xs text-brand-blue/50">× {line.quantity}</span>
                  )}
                </p>
                <span className="whitespace-nowrap font-body text-sm text-brand-blue">
                  {line.priceOnRequest || !Number(line.unitPrice)
                    ? "On request"
                    : formatDA(line.unitPrice * line.quantity)}
                </span>
              </div>
              <p className="mt-1 font-body text-[0.7rem] uppercase tracking-[0.1em] text-brand-blue/50">
                {[line.shape, line.size].filter(Boolean).join(" · ")}
              </p>
              {line.customizationText && (
                <p className="mt-1 line-clamp-2 font-body text-[0.72rem] leading-relaxed text-brand-blue/50">
                  {line.customizationText}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2 font-body text-sm text-brand-blue/80">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatDA(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>{feeKnown ? formatDA(deliveryFee) : "To be confirmed"}</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-brand-gold/25 pt-4">
        <span className="eyebrow text-brand-blue/60">Total</span>
        <span className="font-heading text-2xl text-brand-blue">{formatDA(total)}</span>
      </div>
      {!feeKnown && (
        <p className="mt-3 font-body text-[0.75rem] leading-relaxed text-brand-blue/55">
          {deliveryNote || "Delivery fee will be confirmed after order submission."}
        </p>
      )}
    </aside>
  );
}