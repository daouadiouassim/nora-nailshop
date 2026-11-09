const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export function formatDA(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `${nf.format(Math.round(n))} DA`;
}

export function formatNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? nf.format(n) : "—";
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}