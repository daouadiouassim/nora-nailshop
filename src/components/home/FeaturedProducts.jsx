import { Link } from "react-router-dom";
import Reveal from "@/components/common/Reveal";
import ProductCard from "@/components/shop/ProductCard";

export default function FeaturedProducts({ products }) {
  if (!products?.length) return null;

  return (
    <section className="bg-brand-cream pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-brand-gold/60" />
              <p className="eyebrow text-brand-blue/55">The edit</p>
            </div>
            <h2 className="mt-5 font-heading text-[2.3rem] font-light leading-tight text-brand-blue sm:text-[3rem]">
              Selected <span className="serif-italic">Sets</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="border-b border-brand-gold/40 pb-1 font-body text-[0.62rem] uppercase tracking-[0.2em] text-brand-blue/70 transition-colors hover:border-brand-gold hover:text-brand-blue"
          >
            View all sets
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product, index) => (
            <Reveal key={product.id} delay={(index % 3) * 90}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}