import { useState } from "react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export default function ProductGallery({ images = [], name }) {
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);

  if (list.length === 0) {
    return (
      <div className="aspect-[4/5] w-full bg-brand-lavender/25" aria-label={`${name} image coming soon`} />
    );
  }

  return (
    <div>
      <div className="aspect-[4/5] w-full overflow-hidden bg-white">
        <Image
          src={list[active]}
          alt={`${name} press-on nail set, view ${active + 1}`}
          className="h-full w-full"
          fittingType="fill"
        />
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-3">
          {list.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              className={cn(
                "h-20 w-16 overflow-hidden border transition-colors",
                active === index ? "border-brand-blue" : "border-brand-gold/30 hover:border-brand-gold",
              )}
            >
              <Image src={image} alt="" className="h-full w-full" fittingType="fill" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}