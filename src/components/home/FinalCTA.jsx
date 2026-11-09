import BrandButton from "@/components/common/BrandButton";
import Reveal from "@/components/common/Reveal";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand-blue py-20 text-white lg:py-24">
      <img
        src="/assets/decorations/star-large.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 opacity-25"
      />
      <img
        src="/assets/decorations/sparkle-small.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-10 hidden h-8 w-8 opacity-40 sm:block"
      />
      <div className="mx-auto max-w-[1400px] px-6 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow text-white/55">Nora Nailshop</p>
          <h2 className="mx-auto mt-5 max-w-2xl font-heading text-[2.2rem] font-light leading-tight sm:text-[3.2rem]">
            Ready for Your Next
            <br />
            <span className="serif-italic text-white/90">Favourite Nail Set?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-body text-[0.95rem] text-white/70">
            Discover your style and let us create something unique for you.
          </p>
          <div className="mt-9 flex justify-center">
            <BrandButton to="/shop" variant="light">
              Shop now
            </BrandButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}