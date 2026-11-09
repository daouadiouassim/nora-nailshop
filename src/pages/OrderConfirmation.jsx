import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Check } from "lucide-react";
import { formatDA, formatDate } from "@/lib/format";
import BrandButton from "@/components/common/BrandButton";

export default function OrderConfirmation() {
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    document.title = "Thank you · Nora Nailshop";
    if (order) return;
    try {
      const stored = localStorage.getItem("nora_last_order");
      if (stored) setOrder(JSON.parse(stored));
    } catch {
      setOrder(null);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-28 text-center">
        <h1 className="font-heading text-3xl text-brand-blue">No order to display</h1>
        <p className="mt-3 font-body text-sm text-brand-blue/60">
          Once you place an order, its confirmation appears here.
        </p>
        <BrandButton to="/shop" className="mt-8">Explore collection</BrandButton>
      </div>
    );
  }

  const feeKnown = order.delivery_fee !== null && order.delivery_fee !== undefined;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:py-24">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/50">
          <Check className="h-6 w-6 text-brand-blue" strokeWidth={1.4} />
        </span>
        <h1 className="mt-6 font-heading text-[2.2rem] font-light leading-tight text-brand-blue sm:text-[2.9rem]">
          Thank you for your order!
        </h1>
        <p className="mx-auto mt-4 max-w-lg font-body text-sm leading-relaxed text-brand-blue/65">
          Your order request has been successfully received. Nora Nailshop will contact you to
          confirm your order details.
        </p>
        <p className="mt-6 inline-block bg-brand-blue px-5 py-2.5 font-body text-sm tracking-[0.14em] text-white">
          {order.order_reference}
        </p>
      </div>

      <div className="mt-12 border border-brand-gold/30 bg-white p-6 sm:p-9">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="eyebrow text-brand-gold">Customer</p>
            <p className="mt-2 font-body text-sm text-brand-blue">{order.customer_name}</p>
            <p className="font-body text-sm text-brand-blue/70">{order.phone}</p>
          </div>
          <div>
            <p className="eyebrow text-brand-gold">Delivery</p>
            <p className="mt-2 font-body text-sm text-brand-blue">
              {order.wilaya_code} — {order.wilaya_name}
            </p>
            <p className="font-body text-sm text-brand-blue/70">{order.commune}</p>
            <p className="font-body text-sm text-brand-blue/70">{order.delivery_address}</p>
            {order.delivery_instructions && (
              <p className="mt-1 font-body text-xs italic text-brand-blue/55">
                {order.delivery_instructions}
              </p>
            )}
          </div>
        </div>

        <div className="hairline my-7" />

        <p className="eyebrow text-brand-gold">Your sets</p>
        <ul className="mt-3 divide-y divide-brand-gold/15">
          {order.items?.map((item, index) => (
            <li key={`${item.product_id}-${index}`} className="flex justify-between gap-4 py-3">
              <div>
                <p className="font-body text-sm text-brand-blue">
                  {item.product_name} <span className="text-brand-blue/50">× {item.quantity}</span>
                </p>
                <p className="mt-0.5 font-body text-xs uppercase tracking-[0.1em] text-brand-blue/50">
                  {[item.shape, item.size].filter(Boolean).join(" · ")}
                </p>
                {item.size_note && (
                  <p className="mt-0.5 font-body text-xs text-brand-blue/55">{item.size_note}</p>
                )}
                {item.customization && (
                  <p className="mt-1 font-body text-xs leading-relaxed text-brand-blue/55">
                    {item.customization}
                  </p>
                )}
              </div>
              <span className="whitespace-nowrap font-body text-sm text-brand-blue">
                {item.price_on_request ? "On request" : formatDA(item.line_total)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-2 border-t border-brand-gold/25 pt-5 font-body text-sm text-brand-blue/80">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatDA(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{feeKnown ? formatDA(order.delivery_fee) : "To be confirmed"}</span>
          </div>
          <div className="flex justify-between border-t border-brand-gold/25 pt-3">
            <span className="eyebrow text-brand-blue/60">Total</span>
            <span className="font-heading text-xl text-brand-blue">{formatDA(order.total)}</span>
          </div>
        </div>

        <p className="mt-5 font-body text-xs text-brand-blue/50">
          Order placed on {formatDate(order.created_date)}
          {order.items?.some((item) => item.price_on_request) &&
            " · Custom requests are priced after we review your inspiration."}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <BrandButton to="/shop">Continue shopping</BrandButton>
        <BrandButton
          href="https://www.instagram.com/nora_nailshop/"
          variant="outline"
          aria-label="Contact Nora Nailshop on Instagram"
        >
          Contact us on Instagram
        </BrandButton>
      </div>

      <p className="mt-6 text-center font-body text-xs text-brand-blue/45">
        Keep your reference <span className="text-brand-blue">{order.order_reference}</span> —{" "}
        <Link to="/" className="underline decoration-brand-gold/50 underline-offset-4">back home</Link>
      </p>
    </div>
  );
}