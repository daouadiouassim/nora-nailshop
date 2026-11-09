import { formatDA } from "@/lib/format";

export function composeCustomization(c) {
  if (!c) return "";
  if (typeof c === "string") return c;
  const parts = [];
  if (c.inspiration) parts.push(`Inspiration: ${c.inspiration}`);
  if (c.colors) parts.push(`Colours: ${c.colors}`);
  if (c.design) parts.push(`Design: ${c.design}`);
  if (c.details) parts.push(`Details: ${c.details}`);
  if (c.notes) parts.push(`Requests: ${c.notes}`);
  return parts.join(" · ").slice(0, 600);
}

export function priceLabel(line) {
  if (line.priceOnRequest || !Number(line.unitPrice)) return "On request";
  return formatDA(line.unitPrice);
}

export function lineTotalLabel(line) {
  if (line.priceOnRequest || !Number(line.unitPrice)) return "On request";
  return formatDA(line.unitPrice * line.quantity);
}