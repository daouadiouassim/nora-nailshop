import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/lib/cart";
import { base44 } from "@/api/base44Client";
import { fetchDeliverySettings, fetchStoreSettings } from "@/lib/catalog";
import { composeCustomization } from "@/lib/order";
import { normalizePhone, phoneError } from "@/lib/phone";
import WilayaSelect from "@/components/checkout/WilayaSelect";
import OrderSummary from "@/components/checkout/OrderSummary";
import { cn } from "@/lib/utils";

const FIELD =
  "mt-1.5 h-[52px] w-full border border-brand-gold/35 bg-white px-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none";
const LABEL = "font-body text-xs text-brand-blue/60";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const submissionRef = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const submittedRef = useRef(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    wilaya_code: "",
    commune: "",
    delivery_address: "",
    delivery_instructions: "",
  });
  const [errors, setErrors] = useState({});
  const [delivery, setDelivery] = useState([]);
  const [settings, setSettings] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    document.title = "Checkout · Nora Nailshop";
    fetchDeliverySettings().then(setDelivery).catch(() => setDelivery([]));
    fetchStoreSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  useEffect(() => {
    if (items.length === 0 && !submittedRef.current) {
      navigate("/basket", { replace: true });
    }
  }, [items.length, navigate]);

  const lines = useMemo(
    () =>
      items.map((line) => ({
        ...line,
        customizationText: composeCustomization(line.customization),
      })),
    [items],
  );

  const wilaya = delivery.find((d) => d.wilaya_code === form.wilaya_code);
  const deliveryFee = useMemo(() => {
    if (!form.wilaya_code) return null;
    const threshold = Number(settings?.free_delivery_threshold || 0);
    if (threshold > 0 && subtotal >= threshold) return 0;
    if (wilaya && Number.isFinite(Number(wilaya.delivery_fee)) && wilaya.delivery_fee !== null) {
      return Number(wilaya.delivery_fee);
    }
    if (settings && Number.isFinite(Number(settings.default_delivery_fee)) && settings.default_delivery_fee) {
      return Number(settings.default_delivery_fee);
    }
    return null;
  }, [form.wilaya_code, wilaya, settings, subtotal]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const validate = () => {
    const next = {};
    if (form.full_name.trim().length < 2) next.full_name = "Please enter your full name.";
    const phoneMsg = phoneError(form.phone);
    if (phoneMsg) next.phone = phoneMsg;
    if (!form.wilaya_code) next.wilaya_code = "Please select your wilaya.";
    else if (wilaya && wilaya.is_available === false)
      next.wilaya_code = "Delivery to this wilaya is currently unavailable.";
    if (form.commune.trim().length < 2) next.commune = "Please enter your commune.";
    if (form.delivery_address.trim().length < 5)
      next.delivery_address = "Please enter your full delivery address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitError("");
    if (!validate()) {
      const first = document.querySelector("[data-invalid='true']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      const response = await base44.functions.invoke("createOrder", {
        submission_id: submissionRef.current,
        customer: {
          full_name: form.full_name.trim(),
          phone: normalizePhone(form.phone),
          wilaya_code: form.wilaya_code,
          commune: form.commune.trim(),
          delivery_address: form.delivery_address.trim(),
          delivery_instructions: form.delivery_instructions.trim(),
        },
        items: items.map((line) => ({
          product_id: line.productId,
          quantity: line.quantity,
          shape: line.shape,
          size: line.size,
          size_note: line.sizeNote,
          customization: composeCustomization(line.customization),
        })),
      });

      const order = response?.data?.order;
      if (!order) {
        setSubmitError(
          response?.data?.error || "We could not save your order. Please try again.",
        );
        setSubmitting(false);
        return;
      }

      submittedRef.current = true;
      try {
        localStorage.setItem("nora_last_order", JSON.stringify(order));
      } catch {
        /* confirmation still reachable through navigation state */
      }
      clearCart();
      navigate("/order-confirmation", { state: { order }, replace: true });
    } catch (error) {
      setSubmitError(
        error?.response?.data?.error ||
          "Your order could not be submitted. Your basket is saved — please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-14 sm:px-8 lg:py-20">
      <p className="eyebrow text-brand-blue/50">Checkout</p>
      <h1 className="mt-3 font-heading text-[2.4rem] font-light text-brand-blue sm:text-[3rem]">
        Almost <span className="serif-italic">Yours!</span>
      </h1>
      <p className="mt-3 max-w-lg font-body text-sm leading-relaxed text-brand-blue/65">
        Just a few details before your new favourite nails arrive.
      </p>

      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <section>
            <h2 className="eyebrow text-brand-gold">Your information</h2>
            <div className="mt-5 space-y-4">
              <div data-invalid={errors.full_name ? "true" : "false"}>
                <label className={LABEL} htmlFor="full_name">Full name *</label>
                <input
                  id="full_name"
                  value={form.full_name}
                  onChange={(event) => update("full_name", event.target.value)}
                  autoComplete="name"
                  className={cn(FIELD, errors.full_name && "border-destructive")}
                />
                {errors.full_name && <p className="mt-1 font-body text-xs text-destructive">{errors.full_name}</p>}
              </div>

              <div data-invalid={errors.phone ? "true" : "false"}>
                <label className={LABEL} htmlFor="phone">Phone number *</label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="05 55 12 34 56"
                  className={cn(FIELD, errors.phone && "border-destructive")}
                />
                {errors.phone ? (
                  <p className="mt-1 font-body text-xs text-destructive">{errors.phone}</p>
                ) : (
                  <p className="mt-1 font-body text-[0.7rem] text-brand-blue/45">
                    Algerian mobile: 05, 06, 07 or +213.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="eyebrow text-brand-gold">Delivery</h2>
            <div className="mt-5 space-y-4">
              <div data-invalid={errors.wilaya_code ? "true" : "false"}>
                <label className={LABEL}>Wilaya *</label>
                <WilayaSelect
                  value={form.wilaya_code}
                  onChange={(code) => update("wilaya_code", code)}
                  error={Boolean(errors.wilaya_code)}
                />
                {errors.wilaya_code && (
                  <p className="mt-1 font-body text-xs text-destructive">{errors.wilaya_code}</p>
                )}
              </div>

              <div data-invalid={errors.commune ? "true" : "false"}>
                <label className={LABEL} htmlFor="commune">Commune / city *</label>
                <input
                  id="commune"
                  value={form.commune}
                  onChange={(event) => update("commune", event.target.value)}
                  autoComplete="address-level2"
                  className={cn(FIELD, errors.commune && "border-destructive")}
                />
                {errors.commune && <p className="mt-1 font-body text-xs text-destructive">{errors.commune}</p>}
              </div>

              <div data-invalid={errors.delivery_address ? "true" : "false"}>
                <label className={LABEL} htmlFor="address">Full delivery address *</label>
                <textarea
                  id="address"
                  value={form.delivery_address}
                  onChange={(event) => update("delivery_address", event.target.value)}
                  rows={3}
                  autoComplete="street-address"
                  placeholder="Street, neighbourhood, building, apartment"
                  className={cn(
                    "mt-1.5 w-full border border-brand-gold/35 bg-white p-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none",
                    errors.delivery_address && "border-destructive",
                  )}
                />
                {errors.delivery_address && (
                  <p className="mt-1 font-body text-xs text-destructive">{errors.delivery_address}</p>
                )}
              </div>

              <div>
                <label className={LABEL} htmlFor="instructions">Delivery notes (optional)</label>
                <textarea
                  id="instructions"
                  value={form.delivery_instructions}
                  onChange={(event) => update("delivery_instructions", event.target.value)}
                  rows={2}
                  placeholder="Landmark, preferred time, anything helpful"
                  className="mt-1.5 w-full border border-brand-gold/35 bg-white p-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 bg-brand-lavender/20 p-4">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" strokeWidth={1.4} />
              <p className="font-body text-xs leading-relaxed text-brand-blue/70">
                Delivery available throughout Algeria.
                {deliveryFee === null
                  ? " Delivery fee will be confirmed after order submission."
                  : " Delivery fee is shown in your order summary."}
              </p>
            </div>
          </section>

          {submitError && (
            <p className="mt-6 border border-destructive/30 bg-destructive/5 p-4 font-body text-sm text-destructive" role="alert">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 flex min-h-[56px] w-full items-center justify-center bg-brand-blue font-body text-[0.72rem] uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-ink disabled:opacity-60"
          >
            {submitting ? "Sending your order…" : "Confirm my order"}
          </button>
          <p className="mt-3 flex items-center justify-center gap-2 font-body text-[0.7rem] text-brand-blue/45">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.4} />
            Your details are only used to prepare and deliver your order.
          </p>
          <Link
            to="/basket"
            className="mt-4 block text-center font-body text-[0.65rem] uppercase tracking-[0.16em] text-brand-blue/60 hover:text-brand-blue"
          >
            Back to basket
          </Link>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary
            lines={lines}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            deliveryNote={settings?.delivery_note}
          />
        </div>
      </form>
    </div>
  );
}