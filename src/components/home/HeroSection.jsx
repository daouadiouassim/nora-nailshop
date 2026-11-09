import { Image } from "@/components/ui/image";
import BrandButton from "@/components/common/BrandButton";
import Reveal from "@/components/common/Reveal";

export default function HeroSection({ settings }) {
  const heroImage =
    settings?.hero_image ||
    "/assets/products/hero-custom-set.jpg";

  return (
    <section className="relative overflow-hidden bg-brand-cream">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 pb-16 pt-12 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:pb-24 lg:pt-16">
        <div className="relative z-10">
          <Reveal>
            <div className="flex items-center gap-3">
              <img
                src="/assets/decorations/star-small.png"
                alt=""
                aria-hidden="true"
                className="h-4 w-4 object-contain"
              />
              <p className="eyebrow text-brand-blue/60">Press-on nails · Algérie</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-heading text-[2.9rem] font-light leading-[1.02] tracking-[-0.01em] text-brand-blue sm:text-[3.8rem] lg:text-[4.4rem]">
              Your Nails.
              <br />
              Your Style.
              <br />
              <span className="serif-italic text-brand-ink">Your Signature.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-7 max-w-md font-body text-[1.02rem] leading-relaxed text-brand-blue/70">
              Discover personalised, reusable press-on nails, carefully designed to match
              your style and make every detail special.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <BrandButton to="/shop" variant="primary">
                Explore collection
              </BrandButton>
              <BrandButton to="/custom-nails" variant="outline">
                Create your custom set
              </BrandButton>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-8 flex items-center gap-2 font-body text-[0.72rem] uppercase tracking-[0.2em] text-brand-blue/45">
              Handcrafted with love
              <img
                src="/assets/decorations/sparkle-small.png"
                alt=""
                aria-hidden="true"
                className="h-3.5 w-3.5 object-contain"
              />
              Made just for you
            </p>
          </Reveal>
        </div>

        <Reveal delay={120} className="relative">
          <div className="relative">
            <div className="pointer-events-none absolute -left-4 -top-4 hidden h-full w-full border border-brand-gold/50 sm:block" />
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-lavender/30">
              <Image
                src={heroImage}
                alt="Hand wearing royal blue almond press-on nails with champagne gold accents"
                className="h-full w-full"
                fittingType="fill"
              />
            </div>
            <img
              src="/assets/logos/circular-logo.png"
              alt=""
              aria-hidden="true"
              className="absolute -bottom-8 -left-6 hidden h-24 w-24 rounded-full border border-brand-gold/30 bg-brand-cream p-1 object-contain sm:block"
            />
          </div>
        </Reveal>
      </div>

      <img
        src="/assets/decorations/sparkle-large.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-10 hidden h-10 w-10 opacity-70 lg:block"
      />
    </section>
  );
}