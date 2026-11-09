import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { fetchCategories, fetchProducts } from "@/lib/catalog";
import ProductCard from "@/components/shop/ProductCard";
import Reveal from "@/components/common/Reveal";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export default function Shop() {
  const params = new URLSearchParams(window.location.search);
  const [category, setCategory] = useState(params.get("category") || "All");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 320);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ category, search: query, sort })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, query, sort]);

  const pills = useMemo(
    () => ["All", ...categories.map((c) => c.name)],
    [categories],
  );

  return (
    <div className="bg-brand-cream pb-24">
      <header className="border-b border-brand-gold/25 px-6 pb-12 pt-14 sm:px-8 lg:pb-16 lg:pt-20">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-brand-blue/50">The collection</p>
          <h1 className="mt-4 max-w-2xl font-heading text-[2.6rem] font-light leading-[1.05] text-brand-blue sm:text-[3.6rem]">
            Every set, <span className="serif-italic">made to be worn.</span>
          </h1>
          <p className="mt-4 max-w-xl font-body text-[0.95rem] leading-relaxed text-brand-blue/65">
            Reusable press-on sets, finished by hand and adapted to your size, shape and
            preferences.
          </p>
        </div>
      </header>

      <div className="sticky top-[68px] z-30 border-b border-brand-gold/20 bg-brand-cream/95 backdrop-blur-md lg:top-[76px]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {pills.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => setCategory(pill)}
                className={cn(
                  "whitespace-nowrap border px-4 py-2 font-body text-[0.65rem] uppercase tracking-[0.16em] transition-colors",
                  category === pill
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-brand-gold/35 text-brand-blue/70 hover:border-brand-gold hover:text-brand-blue",
                )}
              >
                {pill}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-blue/40" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search sets"
                aria-label="Search sets"
                className="h-11 w-full border border-brand-gold/30 bg-white/70 pl-9 pr-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/40 focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-blue/40" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort sets"
                className="h-11 appearance-none border border-brand-gold/30 bg-white/70 pl-9 pr-8 font-body text-sm text-brand-blue focus:border-brand-blue focus:outline-none"
              >
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pt-12 sm:px-8">
        {loading ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((key) => (
              <div key={key} className="animate-pulse">
                <div className="aspect-[4/5] w-full bg-brand-lavender/25" />
                <div className="mt-5 h-3 w-2/3 bg-brand-lavender/40" />
                <div className="mt-2 h-3 w-1/2 bg-brand-lavender/25" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="border border-brand-gold/30 bg-white/50 px-8 py-20 text-center">
            <p className="font-heading text-2xl text-brand-blue">No sets found</p>
            <p className="mx-auto mt-3 max-w-sm font-body text-sm text-brand-blue/60">
              Try another collection or clear your search — new designs are added regularly.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setSearch("");
              }}
              className="mt-6 border-b border-brand-gold pb-1 font-body text-[0.65rem] uppercase tracking-[0.18em] text-brand-blue"
            >
              Show all sets
            </button>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={(index % 3) * 70}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}