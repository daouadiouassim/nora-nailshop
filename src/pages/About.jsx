import { useEffect } from "react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/common/Reveal";
import BrandButton from "@/components/common/BrandButton";

const VALUES = [
  {
    title: "Made to measure",
    text: "Each set is sized for your nails, so the fit feels natural rather than improvised.",
  },
  {
    title: "Reusable by design",
    text: "Prepared to be worn, removed and worn again — beauty that lasts beyond one evening.",
  },
  {
    title: "Personal, always",
    text: "Colours, shapes and details chosen with you, never taken from a template.",
  },
];

export default function About() {
  useEffect(() => {
    document.title = "About · Nora Nailshop";
  }, []);

  return (
    <div className="bg-brand-cream pb-24">
      <section className="mx-auto max-w-[1400px] px-6 pt-14 sm:px-8 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow text-brand-blue/50">Our story</p>
            <h1 className="mt-4 font-heading text-[2.6rem] font-light leading-[1.06] text-brand-blue sm:text-[3.4rem]">
              Press-on nails,
              <br />
              <span className="serif-italic">considered down to the detail.</span>
            </h1>
            <p className="mt-6 max-w-lg font-body text-[0.98rem] leading-relaxed text-brand-blue/70">
              Nora Nailshop began with a simple idea: nails should feel like yours, not like
              something borrowed. Every set is personalised, reusable and made to measure — designed
              around a colour you love, a shape that suits your hand and the details that make it
              unmistakably you.
            </p>
            <p className="mt-4 max-w-lg font-body text-[0.98rem] leading-relaxed text-brand-blue/70">
              Sets are made to order and delivered throughout Algeria, to all 69 wilayas. Orders
              are confirmed by message, so every request is looked at personally before it is
              prepared.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <BrandButton to="/shop">Explore collection</BrandButton>
              <BrandButton to="/custom-nails" variant="outline">Create your custom set</BrandButton>
            </div>
          </Reveal>

          <Reveal delay={100} className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden bg-brand-lavender/25">
              <Image
                src="https://media.base44.com/images/public/6af1d8f76e2d976f54fb7b7c/030d64c19_generated_80920241.png"
                alt="Hand wearing royal blue press-on nails with gold accents on cream silk"
                className="h-full w-full"
                fittingType="fill"
              />
            </div>
            <img
              src="/assets/decorations/star-pair.png"
              alt=""
              aria-hidden="true"
              className="absolute -left-5 -top-6 h-12 w-auto"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1400px] px-6 sm:px-8">
        <div className="grid gap-px border-y border-brand-gold/25 sm:grid-cols-3">
          {VALUES.map((value, index) => (
            <Reveal
              key={value.title}
              delay={index * 80}
              className="py-10 sm:px-8 lg:py-14 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-brand-gold/25"
            >
              <p className="font-body text-[0.65rem] tracking-[0.2em] text-brand-gold">
                0{index + 1}
              </p>
              <h2 className="mt-3 font-heading text-2xl text-brand-blue">{value.title}</h2>
              <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-brand-blue/60">
                {value.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl px-6 text-center sm:px-8">
        <img
          src="/assets/decorations/divider-swoosh.png"
          alt=""
          aria-hidden="true"
          className="mx-auto h-6 w-auto opacity-80"
        />
        <p className="mt-6 font-heading text-[1.6rem] font-light italic leading-relaxed text-brand-blue sm:text-[2rem]">
          “Your Style. Your Nails. Your Signature.”
        </p>
      </section>
    </div>
  );
}