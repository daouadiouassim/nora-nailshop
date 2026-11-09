import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Search, Star } from "lucide-react";
import { WILAYAS } from "@/data/wilayas";
import { cn } from "@/lib/utils";

export default function WilayaSelect({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = WILAYAS.find((w) => w.code === value) || null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return WILAYAS;
    return WILAYAS.filter(
      (w) => w.name.toLowerCase().includes(q) || w.code.includes(q),
    );
  }, [query]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-[52px] w-full items-center justify-between border bg-white px-3 text-left font-body text-sm transition-colors",
          error ? "border-destructive" : "border-brand-gold/35 hover:border-brand-gold",
        )}
      >
        <span className={selected ? "text-brand-blue" : "text-brand-blue/40"}>
          {selected ? `${selected.code} — ${selected.name}` : "Select your wilaya"}
        </span>
        <span className="flex items-center gap-2">
          {selected && <Star className="h-3.5 w-3.5 text-brand-gold" strokeWidth={1.6} />}
          <ChevronsUpDown className="h-4 w-4 text-brand-blue/40" />
        </span>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full border border-brand-gold/40 bg-white shadow-xl">
          <div className="relative border-b border-brand-gold/20">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-blue/40" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search wilaya or code"
              aria-label="Search wilaya"
              className="h-11 w-full bg-transparent pl-9 pr-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/40 focus:outline-none"
            />
          </div>
          <ul role="listbox" className="max-h-64 overflow-y-auto">
            {results.length === 0 && (
              <li className="px-4 py-3 font-body text-sm text-brand-blue/50">No wilaya found</li>
            )}
            {results.map((wilaya) => (
              <li key={wilaya.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === wilaya.code}
                  onClick={() => {
                    onChange(wilaya.code);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left font-body text-sm transition-colors hover:bg-brand-lavender/25",
                    value === wilaya.code ? "text-brand-blue" : "text-brand-blue/75",
                  )}
                >
                  <span>
                    <span className="mr-2 text-brand-blue/40">{wilaya.code}</span>
                    {wilaya.name}
                  </span>
                  {value === wilaya.code && <Check className="h-3.5 w-3.5 text-brand-gold" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}