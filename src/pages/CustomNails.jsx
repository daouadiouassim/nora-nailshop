import { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "@/lib/catalog";
import { formatDA } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { NAIL_SHAPES, NAIL_SIZES } from "@/data/wilayas";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/common/Reveal";
import { cn } from "@/lib/utils";

const FIELD =
  "mt-1.5 h-[52px] w-full border border-brand-gold/35 bg-white px-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none";

export default function CustomNails() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [baseId, setBaseId] = useState("custom-request");
  const [shape, setShape] = useState("Almond");
  const [size, setSize] = useState("M");
  const [inspiration, setInspiration] = useState("");
  const [colors, setColors] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Custom nails · Nora Nailshop";
    fetchFeaturedProducts(20).then(setProducts).catch(() => setProducts([]));
  }, []);

  const base = products.find((product) => product.id === baseId) || null;

  const addToBasket = () => {
    setError("");
    if (inspiration.trim().length < 5) {
      setError("Please describe the set you have in mind.");
      return;
    }

    addItem({
      productId: base ? base.id : "custom-request",
      name: base ? `${base.name} — customised` : "Custom set request",
      slug: base?.slug || "",
      image: base?.images?.[0] || "",
      unitPrice: base ? base.price : 0,
      priceOnRequest: !base,
      quantity: 1,
      shape,
      size,
      sizeNote: "",
      customization: {
        inspiration: inspiration.trim(),
        colors: colors.trim(),
        details: details.trim(),
      },
    });
  };

  return (
    <div className="bg-brand-cream pb-24">
      <div className="mx-auto max-w-[1400px] px-6 pt-14 sm:px-8 lg:pt-20">
        <div className="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28">
            <p className="eyebrow text-brand-blue/50">Custom nails</p>
            <h1 className="mt-4 font-heading text-[2.6rem] font-light leading-[1.06] text-brand-blue sm:text-[3.4rem]">
              Made for You,
              <br />
              <span className="serif-italic">Made to Be Unique.</span>
            </h1>
            <p className="mt-5 max-w-md font-body text-[0.95rem] leading-relaxed text-brand-blue/70">
              Your nails should reflect your personality. Tell us what you have in mind — a
              colour, a mood, a photo you love — and Nora Nailshop will create a set made
              especially for you.
            </p>
            <div className="mt-8 aspect-[4/3] w-full overflow-hidden bg-brand-lavender/20">
              <Image
                src="/assets/products/horror-eye-set.jpg"
                alt="Cream nail tips in five shapes on royal blue velvet"
                className="h-full w-full"
                fittingType="fill"
              />
            </div>
            <ul className="mt-7 space-y-2 font-body text-sm text-brand-blue/65">
              <li>01 — Choose your inspiration.</li>
              <li>02 — Select your preferred shape and size.</li>
              <li>03 — Choose colours and details.</li>
              <li>04 — Add your custom request.</li>
              <li>05 — Place your order.</li>
            </ul>
          </Reveal>

          <Reveal delay={80} className="border border-brand-gold/30 bg-white p-6 sm:p-9">
            <h2 className="font-heading text-2xl text-brand-blue">Your custom request</h2>

            <div className="mt-6 space-y-4">
              <div>
                <label className="font-body text-xs text-brand-blue/60" htmlFor="base">
                  Start from a design (optional)
                </label>
                <select
                  id="base"
                  value={baseId}
                  onChange={(event) => setBaseId(event.target.value)}
                  className={cn(FIELD, "appearance-none")}
                >
                  <option value="custom-request">Fully custom — price confirmed by message</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} · {formatDA(product.price)}
                    </option>
                  ))}
                </select>
                <p className="mt-1 font-body text-[0.7rem] text-brand-blue/45">
                  {base
                    ? `Your customised set keeps the ${formatDA(base.price)} base price.`
                    : "A fully custom set is priced after we review your inspiration."}
                </p>
              </div>

              <div>
                <label className="font-body text-xs text-brand-blue/60">Nail shape</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {NAIL_SHAPES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setShape(option)}
                      aria-pressed={shape === option}
                      className={cn(
                        "min-h-[48px] border px-4 font-body text-[0.68rem] uppercase tracking-[0.12em] transition-colors",
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

              <div>
                <label className="font-body text-xs text-brand-blue/60">Size</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {NAIL_SIZES.map((option) => (
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
              </div>

              <div>
                <label className="font-body text-xs text-brand-blue/60" htmlFor="inspiration">
                  Your inspiration *
                </label>
                <textarea
                  id="inspiration"
                  value={inspiration}
                  onChange={(event) => setInspiration(event.target.value)}
                  rows={3}
                  placeholder="Describe the set you dream of, or tell us which post inspired you."
                  className="mt-1.5 w-full border border-brand-gold/35 bg-white p-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="font-body text-xs text-brand-blue/60" htmlFor="colors">
                  Preferred colours
                </label>
                <input
                  id="colors"
                  value={colors}
                  onChange={(event) => setColors(event.target.value)}
                  placeholder="Royal blue, champagne gold, lavender…"
                  className={FIELD}
                />
              </div>

              <div>
                <label className="font-body text-xs text-brand-blue/60" htmlFor="details">
                  Decorative details
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  rows={2}
                  placeholder="Stars, pearls, chrome, foil, French tips…"
                  className="mt-1.5 w-full border border-brand-gold/35 bg-white p-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none"
                />
              </div>

              {error && (
                <p className="font-body text-sm text-destructive" role="alert">{error}</p>
              )}

              <button
                type="button"
                onClick={addToBasket}
                className="flex min-h-[56px] w-full items-center justify-center bg-brand-blue font-body text-[0.72rem] uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-ink"
              >
                Add to basket
              </button>
              <p className="text-center font-body text-[0.7rem] text-brand-blue/45">
                Sizing help and measurements are confirmed with you by message after ordering.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}