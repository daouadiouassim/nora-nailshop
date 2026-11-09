import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Custom Nails", to: "/custom-nails" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const BagButton = ({ className }) => (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open shopping bag, ${count} item${count === 1 ? "" : "s"}`}
      className={cn(
        "relative inline-flex h-11 w-11 items-center justify-center text-brand-blue transition-colors hover:text-brand-gold",
        className,
      )}
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-brand-gold px-1 font-body text-[0.62rem] font-medium text-brand-ink">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-brand-gold/25 bg-brand-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 sm:px-8 lg:py-4">
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-11 w-11 items-center justify-center text-brand-blue"
          >
            <Menu className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </div>

        <BrandLogo className="h-10 sm:h-12 lg:h-14" />

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "eyebrow relative py-2 text-brand-blue/70 transition-colors hover:text-brand-blue",
                  isActive && "text-brand-blue",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brand-gold transition-transform duration-300",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <a
            href="https://www.instagram.com/nora_nailshop/"
            target="_blank"
            rel="noreferrer"
            aria-label="Nora Nailshop on Instagram"
            className="hidden h-11 w-11 items-center justify-center opacity-80 transition-opacity hover:opacity-100 sm:inline-flex"
          >
            <img src="/assets/social/instagram.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
          </a>
          <BagButton />
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-[84%] max-w-sm flex-col bg-brand-cream px-7 py-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <BrandLogo className="h-10" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center text-brand-blue"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
            <div className="hairline my-6" />
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="border-b border-brand-gold/15 py-4 font-heading text-2xl text-brand-blue"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex items-center gap-4 pt-8">
              <a href="https://www.instagram.com/nora_nailshop/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <img src="/assets/social/instagram.png" alt="" aria-hidden="true" className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@nora_nailshop" target="_blank" rel="noreferrer" aria-label="TikTok">
                <img src="/assets/social/tiktok.png" alt="" aria-hidden="true" className="h-5 w-5" />
              </a>
              <span className="eyebrow text-[0.6rem] text-brand-blue/50">@nora_nailshop</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}