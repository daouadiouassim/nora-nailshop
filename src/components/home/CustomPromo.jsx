import { Image } from "@/components/ui/image";
import Reveal from "@/components/common/Reveal";
import BrandButton from "@/components/common/BrandButton";

const STEPS = [
  "Choose your inspiration.",
  "Select your preferred shape and size.",
  "Choose colours and details.",
  "Add your custom request.",
  "Place your order.",
];

export default function CustomPromo() {
  return (
    <section className="relative overflow-hidden bg-brand-lavender/25 py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/3] w-full overflow-hidden bg-brand-cream">
              <Image
                src="/assets/products/horror-eye-set.jpg"
                alt="Cream nail tip shapes arranged on royal blue velvet with a gold chain"
                className="h-full w-full"
                fittingType="fill"
              />
            </div>
            <img
              src="/assets/decorations/star-pair.png"
              alt=""
              aria-hidden="true"
              className="absolute -right-4 -top-6 h-12 w-auto object-contain"
            />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="eyebrow text-brand-blue/55">Custom nails</p>
          <h2 className="mt-5 font-heading text-[2.3rem] font-light leading-tight text-brand-blue sm:text-[3rem]">
            Made for You,
            <br />
            <span className="serif-italic">Made to Be Unique.</span>
          </h2>
          <p className="mt-5 max-w-lg font-body text-[0.95rem] leading-relaxed text-brand-blue/70">
            Your nails should reflect your personality. Choose your preferred style, shape,
            colours and details, and let Nora Nailshop create a set made especially for you.
          </p>

          <ol className="mt-8 space-y-3">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span className="mt-0.5 font-body text-[0.65rem] tracking-[0.16em] text-brand-gold">
                  0{index + 1}
                </span>
                <span className="font-body text-sm text-brand-blue/80">{step}</span>
              </li>
            ))}
          </ol>

          <BrandButton to="/custom-nails" variant="primary" className="mt-9">
            Create your custom set
          </BrandButton>
        </Reveal>
      </div>
    </section>
  );
}