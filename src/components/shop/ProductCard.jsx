import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatDA } from "@/lib/format";
import { useCart } from "@/lib/cart";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const images = product.images?.length ? product.images : [product.image].filter(Boolean);
  const cover = images[0];

  const quickAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: cover,
      unitPrice: product.price,
      quantity: 1,
      shape: product.shapes?.[0] || "",
      size: product.sizes?.[0] || "",
      sizeNote: "",
      customization: {},
    });
  };

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-white">
        <Link to={`/shop/${product.slug}`} className="block" aria-label={`View ${product.name}`}>
          <div className="aspect-[4/5] w-full overflow-hidden">
            {cover ? (
              <Image
                src={cover}
                alt={`${product.name} press-on nail set`}
                className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                fittingType="fill"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-lavender/30 font-heading text-2xl italic text-brand-blue/40">
                Image coming soon
              </div>
            )}
          </div>
        </Link>

        {product.category && (
          <span className="absolute left-4 top-4 bg-brand-cream/90 px-3 py-1 font-body text-[0.6rem] uppercase tracking-[0.2em] text-brand-blue/80">
            {product.category}
          </span>
        )}

        <button
          type="button"
          onClick={quickAdd}
          className="absolute bottom-0 left-0 right-0 flex min-h-[46px] translate-y-full items-center justify-center gap-2 bg-brand-blue/95 font-body text-[0.65rem] uppercase tracking-[0.2em] text-white transition-transform duration-300 group-hover:translate-y-0 focus-visible:translate-y-0"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.6} /> Add to basket
        </button>
      </div>

      <div className="pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-heading text-[1.35rem] leading-tight text-brand-blue">
            <Link to={`/shop/${product.slug}`} className="transition-colors hover:text-brand-ink">
              {product.name}
            </Link>
          </h3>
          <span className="whitespace-nowrap font-body text-sm text-brand-blue">
            {formatDA(product.price)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 font-body text-[0.83rem] leading-relaxed text-brand-blue/60">
          {product.description}
        </p>
        <Link
          to={`/shop/${product.slug}`}
          className="mt-3 inline-block border-b border-brand-gold/40 pb-0.5 font-body text-[0.62rem] uppercase tracking-[0.2em] text-brand-blue/70 transition-colors hover:border-brand-gold hover:text-brand-blue"
        >
          View details
        </Link>
      </div>
    </article>
  );
}