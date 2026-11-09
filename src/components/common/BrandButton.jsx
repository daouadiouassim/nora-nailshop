import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 font-body uppercase tracking-[0.18em] text-[0.7rem] font-medium transition-all duration-300 min-h-[48px] px-7 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-brand-blue text-white hover:bg-brand-ink",
  outline:
    "border border-brand-blue/60 text-brand-blue hover:border-brand-gold hover:bg-brand-lavender/30",
  gold: "bg-brand-gold text-brand-ink hover:bg-brand-gold/85",
  light: "bg-white text-brand-blue hover:bg-brand-cream",
  quiet:
    "border border-brand-gold/40 text-brand-blue hover:border-brand-gold hover:bg-white/60",
};

export default function BrandButton({
  children,
  to,
  href,
  variant = "primary",
  className,
  type = "button",
  ...props
}) {
  const classes = cn(base, variants[variant], className);

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}