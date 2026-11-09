import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/common/Reveal";

const CATEGORY_IMAGES = {
  French: "https://media.base44.com/images/public/6af1d8f76e2d976f54fb7b7c/b3ffbff0b_generated_92ecf28b.png",
  Minimalist: "https://media.base44.com/images/public/6af1d8f76e2d976f54fb7b7c/f84803f26_generated_6fc6432b.png",
  Elegant: "https://media.base44.com/images/public/6af1d8f76e2d976f54fb7b7c/5bda943c7_generated_e99cd80a.png",
  Glam: "https://media.base44.com/images/public/6af1d8f76e2d976f54fb7b7c/5c4429d02_generated_66e6d247.png",
  Everyday: "https://media.base44.com/images/public/6af1d8f76e2d976f54fb7b7c/163ee365f_generated_8e316744.png",
  Custom: "https://media.base44.com/images/public/6af1d8f76e2d976f54fb7b7c/b16921e2a_generated_fa46c818.png",
};

export default function FeaturedCollections({ categories }) {
  const list = categories?.length
    ? categories
    : [
        { name: "French", slug: "French", description: "Timeless tips, reimagined in soft milky tones." },
        { name: "Minimalist", slug: "Minimalist", description: "Barely-there finishes with a single precious detail." },
        { name: "Elegant", slug: "Elegant", description: "Sculpted almond shapes in deep, jewel-toned polish." },
        { name: "Glam", slug: "Glam", description: "Champagne glitter, crystals and metallic shine." },
        { name: "Everyday", slug: "Everyday", description: "Short, glossy and made for every day of the week." },
        { name: "Custom", slug: "Custom", description: "Your own composition, drawn from your inspiration." },
      ];

  return (
    <section className="bg-brand-cream py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8">
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand-gold/60" />
            <p className="eyebrow text-brand-blue/55">Collections</p>
          </div>
          <h2 className="mt-5 font-heading text-[2.3rem] font-light leading-tight text-brand-blue sm:text-[3rem]">
            Find Your <span className="serif-italic">Perfect Set</span>
          </h2>
          <p className="mt-3 font-body text-[0.95rem] text-brand-blue/65">
            Explore nail designs created to express your personality.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((category, index) => (
            <Reveal key={category.slug || category.name} delay={(index % 3) * 90}>
              <Link
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group block"
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-brand-lavender/25">
                  <Image
                    src={category.image || CATEGORY_IMAGES[category.name]}
                    alt={`${category.name} press-on nail collection`}
                    className="h-full w-full transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                    fittingType="fill"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/45 via-transparent to-transparent opacity-70" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-heading text-[1.6rem] leading-none text-white">
                      {category.name}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <p className="max-w-[16rem] font-body text-[0.83rem] leading-relaxed text-brand-blue/60">
                    {category.description}
                  </p>
                  <span className="mt-1 whitespace-nowrap border-b border-brand-gold/40 pb-0.5 font-body text-[0.6rem] uppercase tracking-[0.2em] text-brand-blue/70 transition-colors group-hover:border-brand-gold group-hover:text-brand-blue">
                    Explore
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}