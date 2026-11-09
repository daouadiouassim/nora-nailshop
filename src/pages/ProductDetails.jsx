import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, Minus, Plus, Star } from "lucide-react";
import { fetchProductBySlug } from "@/lib/catalog";
import { formatDA } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import ProductGallery from "@/components/product/ProductGallery";
import BrandButton from "@/components/common/BrandButton";
import { NAIL_SHAPES, NAIL_SIZES } from "@/data/wilayas";

const SIZING_MODES = [
  { value: "standard", label: "Standard size", hint: "Choose the size closest to your natural nails." },
  { value: "custom", label: "Custom measurements", hint: "Send your measurements below and we will size your set exactly." },
  { value: "help", label: "I need help choosing my size", hint: "We will guide you through measuring before we start." },
];

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [shape, setShape] = useState("");
  const [size, setSize] = useState("");
  const [sizingMode, setSizingMode] = useState("standard");
  const [measurements, setMeasurements] = useState("");
  const [colors, setColors] = useState("");
  const [design, setDesign] = useState("");
  const [details, setDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProductBySlug(slug)
      .then((row) => {
        if (!active) return;
        setProduct(row);
        setShape(row?.shapes?.[0] || "");
        setSize(row?.sizes?.includes("M") ? "M" : row?.sizes?.[0] || "");
      })
      .catch(() => setProduct(null))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!loading && !product) {
      const meta = document.createElement("meta");
      meta.name = "prerender-status-code";
      meta.content = "404";
      document.head.appendChild(meta);
      return () => document.head.removeChild(meta);
    }
    return undefined;
  }, [loading, product]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-[4/5] w-full animate-pulse bg-brand-lavender/25" />
          <div className="space-y-4">
            <div className="h-4 w-1/3 animate-pulse bg-brand-lavender/30" />
            <div className="h-10 w-2/3 animate-pulse bg-brand-lavender/30" />
            <div className="h-24 w-full animate-pulse bg-brand-lavender/20" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="eyebrow text-brand-gold">Not found</p>
        <h1 className="mt-4 font-heading text-3xl text-brand-blue">This set is no longer here</h1>
        <p className="mt-3 font-body text-sm text-brand-blue/60">
          It may have been renamed or removed. Discover the current collection instead.
        </p>
        <BrandButton to="/shop" className="mt-8">
          Back to the collection
        </BrandButton>
      </div>
    );
  }

  const shapes = product.shapes?.length ? product.shapes : NAIL_SHAPES;
  const sizes = product.sizes?.length ? product.sizes : NAIL_SIZES;

  const addToBasket = () => {
    setError("");
    if (!shape) return setError("Please choose a nail shape.");
    if (sizingMode === "standard" && !size) return setError("Please choose your size.");
    if (sizingMode === "custom" && measurements.trim().length < 3)
      return setError("Please add your measurements so we can size your set.");

    const sizeNote =
      sizingMode === "custom"
        ? `Custom measurements: ${measurements.trim()}`
        : sizingMode === "help"
          ? "Needs help choosing a size"
          : "";

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] || "",
      unitPrice: product.price,
      quantity,
      shape,
      size: sizingMode === "standard" ? size : "",
      sizeNote,
      customization: {
        colors: colors.trim(),
        design: design.trim(),
        details: details.trim(),
        notes: notes.trim(),
      },
    });
  };

  return (
    <div className="bg-brand-cream pb-24">
      <div className="mx-auto max-w-[1400px] px-6 pt-8 sm:px-8">
        <nav className="font-body text-[0.68rem] uppercase tracking-[0.16em] text-brand-blue/45" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-brand-blue">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-brand-blue">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-blue/70">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto mt-8 grid max-w-[1400px] gap-12 px-6 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div>
          <p className="eyebrow text-brand-gold">{product.category || "Press-on set"}</p>
          <h1 className="mt-3 font-heading text-[2.4rem] font-light leading-tight text-brand-blue sm:text-[3rem]">
            {product.name}
          </h1>
          <p className="mt-2 font-heading text-2xl text-brand-blue">{formatDA(product.price)}</p>
          <p className="mt-5 max-w-lg font-body text-[0.95rem] leading-relaxed text-brand-blue/70">
            {product.description}
          </p>

          <div className="mt-9">
            <p className="eyebrow text-brand-blue/60">Nail shape</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {shapes.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setShape(option)}
                  aria-pressed={shape === option}
                  className={cn(
                    "min-h-[48px] border px-5 font-body text-[0.7rem] uppercase tracking-[0.14em] transition-colors",
                    shape === option
                      ? "border-brand-blue bg-brand-blue text-white"
                      : "border-brand-gold/35 text-brand-blue/75 hover:border-brand-gold",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="eyebrow text-brand-blue/60">Sizing</p>
            <div className="mt-3 space-y-2">
              {SIZING_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setSizingMode(mode.value)}
                  className={cn(
                    "flex w-full items-start gap-3 border px-4 py-3 text-left transition-colors",
                    sizingMode === mode.value
                      ? "border-brand-blue bg-white"
                      : "border-brand-gold/30 hover:border-brand-gold",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      sizingMode === mode.value ? "border-brand-blue bg-brand-blue" : "border-brand-blue/30",
                    )}
                  >
                    {sizingMode === mode.value && <Check className="h-2.5 w-2.5 text-white" />}
                  </span>
                  <span>
                    <span className="block font-body text-sm text-brand-blue">{mode.label}</span>
                    <span className="block font-body text-xs leading-relaxed text-brand-blue/50">
                      {mode.hint}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {sizingMode === "standard" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    aria-pressed={size === option}
                    className={cn(
                      "min-h-[48px] min-w-[56px] border px-4 font-body text-sm transition-colors",
                      size === option
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-brand-gold/35 text-brand-blue/75 hover:border-brand-gold",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {sizingMode === "custom" && (
              <textarea
                value={measurements}
                onChange={(event) => setMeasurements(event.target.value)}
                placeholder="Your measurements in mm for each nail (thumb to pinky), or how you would like to send them."
                rows={3}
                className="mt-3 w-full border border-brand-gold/35 bg-white p-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none"
              />
            )}
          </div>

          {product.customization_enabled !== false && (
            <div className="mt-8 space-y-4">
              <p className="eyebrow text-brand-blue/60">Customisation</p>
              <div>
                <label htmlFor="colors" className="font-body text-xs text-brand-blue/60">
                  Preferred colours
                </label>
                <input
                  id="colors"
                  value={colors}
                  onChange={(event) => setColors(event.target.value)}
                  placeholder="Royal blue, champagne gold…"
                  className="mt-1.5 h-12 w-full border border-brand-gold/35 bg-white px-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="design" className="font-body text-xs text-brand-blue/60">
                  Design changes
                </label>
                <textarea
                  id="design"
                  value={design}
                  onChange={(event) => setDesign(event.target.value)}
                  rows={2}
                  placeholder="Anything you would like adapted from this set"
                  className="mt-1.5 w-full border border-brand-gold/35 bg-white p-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="details" className="font-body text-xs text-brand-blue/60">
                  Decorative details
                </label>
                <input
                  id="details"
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="Stars, pearls, gold flakes…"
                  className="mt-1.5 h-12 w-full border border-brand-gold/35 bg-white px-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="notes" className="font-body text-xs text-brand-blue/60">
                  Additional notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={2}
                  placeholder="Anything else we should know"
                  className="mt-1.5 w-full border border-brand-gold/35 bg-white p-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-brand-gold/40 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-12 w-11 items-center justify-center text-brand-blue"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-body text-sm text-brand-blue">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                aria-label="Increase quantity"
                className="flex h-12 w-11 items-center justify-center text-brand-blue"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={addToBasket}
              className="flex min-h-[48px] flex-1 items-center justify-center bg-brand-blue px-6 font-body text-[0.7rem] uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-ink"
            >
              Add to basket
            </button>
          </div>

          {error && (
            <p className="mt-3 font-body text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="mt-8 flex items-start gap-3 border-t border-brand-gold/25 pt-6">
            <Star className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" strokeWidth={1.4} />
            <p className="font-body text-xs leading-relaxed text-brand-blue/55">
              Reusable and made to order. Each set is prepared after your order is confirmed,
              with delivery available to all 69 wilayas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="mt-6 border-b border-brand-gold/40 pb-1 font-body text-[0.65rem] uppercase tracking-[0.18em] text-brand-blue/70 hover:text-brand-blue"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}