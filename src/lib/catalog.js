import { base44 } from "@/api/base44Client";

async function pageItems(promise) {
  const result = await promise;
  if (Array.isArray(result)) return result;
  return result?.items || [];
}

export async function fetchProducts({ category, search, sort } = {}) {
  const query = { is_available: true };
  if (category && category !== "All") query.category = category;
  if (search) query.name = { $regex: String(search).trim(), $options: "i" };

  const sortOption =
    sort === "price-asc" ? "price" : sort === "price-desc" ? "-price" : "-created_date";

  return pageItems(
    base44.entities.Product.filter(query, { sort: sortOption, limit: 60 }),
  );
}

export async function fetchFeaturedProducts(limit = 6) {
  return pageItems(base44.entities.Product.filter({ is_available: true }, { sort: "sort_order", limit }));
}

export async function fetchProductBySlug(slug) {
  const items = await pageItems(base44.entities.Product.filter({ slug }, { limit: 1 }));
  return items[0] || null;
}

export async function fetchCategories() {
  return pageItems(base44.entities.Category.list({ sort: "sort_order", limit: 30 }));
}

export async function fetchDeliverySettings() {
  return pageItems(base44.entities.DeliverySetting.list({ sort: "wilaya_code", limit: 200 }));
}

export async function fetchStoreSettings() {
  const items = await pageItems(base44.entities.StoreSettings.list("-created_date", 1));
  return items[0] || null;
}