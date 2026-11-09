import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function BrandLogo({ className, variant = "main" }) {
  const src =
    variant === "stacked"
      ? "/assets/logos/wordmark-stacked.png"
      : "/assets/logos/main-logo.png";

  return (
    <Link to="/" aria-label="Nora Nailshop — home" className="inline-flex items-center">
      <img
        src={src}
        alt="Nora Nailshop"
        className={cn("w-auto object-contain", className)}
        style={{ maxHeight: "100%" }}
      />
    </Link>
  );
}