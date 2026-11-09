import { useEffect } from "react";
import { Mail, Truck, Sparkles } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import BrandButton from "@/components/common/BrandButton";

const FAQ = [
  {
    q: "How do I place an order?",
    a: "Choose your sets, customise them and complete the checkout on this website. Your order is saved straight away and confirmed with you by message.",
  },
  {
    q: "How do I choose my size?",
    a: "Pick a standard size if you know it, or select custom measurements and send your measurements — we will guide you through it.",
  },
  {
    q: "When is the delivery fee confirmed?",
    a: "Delivery pricing depends on your wilaya and is confirmed with you after your order is received.",
  },
  {
    q: "Are the nails reusable?",
    a: "Yes. Every set is reusable when removed and stored with care.",
  },
];

export default function Contact() {
  useEffect(() => {
    document.title = "Contact · Nora Nailshop";
  }, []);

  return (
    <div className="bg-brand-cream pb-24">
      <div className="mx-auto max-w-[1400px] px-6 pt-14 sm:px-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow text-brand-blue/50">Contact</p>
            <h1 className="mt-4 font-heading text-[2.6rem] font-light leading-[1.06] text-brand-blue sm:text-[3.4rem]">
              Let’s talk
              <br />
              <span className="serif-italic">about your nails.</span>
            </h1>
            <p className="mt-5 max-w-md font-body text-[0.95rem] leading-relaxed text-brand-blue/70">
              Questions about a set, sizing or a custom idea? Send a message on Instagram — it is
              the fastest way to reach Nora Nailshop. Orders themselves are placed right here on
              the website.
            </p>

            <div className="mt-9 space-y-3">
              <a
                href="https://www.instagram.com/nora_nailshop/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 border border-brand-gold/30 bg-white p-4 transition-colors hover:border-brand-gold"
              >
                <img src="/assets/social/instagram.png" alt="" aria-hidden="true" className="h-6 w-6" />
                <span>
                  <span className="block font-body text-sm text-brand-blue">Instagram</span>
                  <span className="block font-body text-xs text-brand-blue/55">@nora_nailshop</span>
                </span>
              </a>
              <a
                href="https://www.tiktok.com/@nora_nailshop"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 border border-brand-gold/30 bg-white p-4 transition-colors hover:border-brand-gold"
              >
                <img src="/assets/social/tiktok.png" alt="" aria-hidden="true" className="h-6 w-6" />
                <span>
                  <span className="block font-body text-sm text-brand-blue">TikTok</span>
                  <span className="block font-body text-xs text-brand-blue/55">@nora_nailshop</span>
                </span>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <BrandButton href="https://www.instagram.com/nora_nailshop/" variant="primary">
                Message on Instagram
              </BrandButton>
              <BrandButton to="/shop" variant="outline">
                Browse the collection
              </BrandButton>
            </div>
          </Reveal>

          <Reveal delay={100} className="space-y-8">
            <div className="bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-brand-gold" strokeWidth={1.4} />
                <p className="eyebrow text-brand-blue/60">Delivery</p>
              </div>
              <p className="mt-3 font-body text-sm leading-relaxed text-brand-blue/70">
                Delivery available throughout Algeria — all 69 wilayas. The fee for your wilaya is
                confirmed after your order is received.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-brand-gold" strokeWidth={1.4} />
                <p className="eyebrow text-brand-blue/60">Orders</p>
              </div>
              <p className="mt-3 font-body text-sm leading-relaxed text-brand-blue/70">
                Orders are open. Each set is made to order after confirmation, so tell us about any
                deadline when you check out.
              </p>
            </div>

            <div>
              <p className="eyebrow text-brand-gold">Questions</p>
              <dl className="mt-4 divide-y divide-brand-gold/20 border-y border-brand-gold/25">
                {FAQ.map((item) => (
                  <div key={item.q} className="py-4">
                    <dt className="font-heading text-lg text-brand-blue">{item.q}</dt>
                    <dd className="mt-1 font-body text-sm leading-relaxed text-brand-blue/60">
                      {item.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="flex items-start gap-3 font-body text-xs leading-relaxed text-brand-blue/45">
              <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.4} />
              Prefer a written confirmation? Every order placed here gives you a reference number to
              quote when you message us.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}