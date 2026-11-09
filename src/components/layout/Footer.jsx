import { Link } from "react-router-dom";
import BrandLogo from "@/components/common/BrandLogo";

const EXPLORE = [
  { label: "Shop all", to: "/shop" },
  { label: "Custom nails", to: "/custom-nails" },
  { label: "About Nora", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const SHOPPING = [
  { label: "Your basket", to: "/basket" },
  { label: "Checkout", to: "/checkout" },
  { label: "How to order", to: "/#how-to-order" },
];

export default function Footer({ settings }) {
  const instagram = settings?.instagram_url || "https://www.instagram.com/nora_nailshop/";
  const tiktok = settings?.tiktok_url || "https://www.tiktok.com/@nora_nailshop";

  return (
    <footer className="border-t border-brand-gold/30 bg-brand-cream">
      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1fr]">
          <div>
            <BrandLogo variant="stacked" className="h-16" />
            <p className="mt-6 max-w-xs font-body text-sm leading-relaxed text-brand-blue/70">
              Personalised, reusable press-on nails — made to measure, made to order and
              finished by hand in Algeria.
            </p>
            <div className="mt-7 flex items-center gap-3">
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Nora Nailshop on Instagram"
                className="inline-flex h-11 w-11 items-center justify-center border border-brand-gold/40 transition-colors hover:border-brand-gold"
              >
                <img src="/assets/social/instagram.png" alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
              </a>
              <a
                href={tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="Nora Nailshop on TikTok"
                className="inline-flex h-11 w-11 items-center justify-center border border-brand-gold/40 transition-colors hover:border-brand-gold"
              >
                <img src="/assets/social/tiktok.png" alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow text-brand-gold">Explore</p>
            <ul className="mt-5 space-y-3">
              {EXPLORE.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-body text-sm text-brand-blue/75 transition-colors hover:text-brand-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-brand-gold">Shopping</p>
            <ul className="mt-5 space-y-3">
              {SHOPPING.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-body text-sm text-brand-blue/75 transition-colors hover:text-brand-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="font-body text-sm text-brand-blue/75">Made to order</li>
              <li className="font-body text-sm text-brand-blue/75">Reusable sets</li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-brand-gold">Delivery</p>
            <p className="mt-5 font-body text-sm leading-relaxed text-brand-blue/75">
              Delivery available to all 69 wilayas across Algeria. The delivery fee is
              confirmed with you after your order is received.
            </p>
            <p className="mt-4 font-body text-sm text-brand-blue/75">
              Orders are confirmed by message — you can also reach us on Instagram.
            </p>
          </div>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <img
            src="/assets/decorations/footer-tagline.png"
            alt="Your Style. Your Nails. Your Signature."
            className="h-9 w-auto object-contain opacity-80"
          />
          <div className="flex items-center gap-5">
            <Link
              to="/admin"
              className="font-body text-[0.6rem] uppercase tracking-[0.16em] text-brand-blue/35 transition-colors hover:text-brand-blue/70"
            >
              Admin
            </Link>
            <p className="font-body text-xs tracking-wide text-brand-blue/50">
              © {new Date().getFullYear()} Nora Nailshop · Algérie
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}