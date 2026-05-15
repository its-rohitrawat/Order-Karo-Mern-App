/** Match food items and shops against a navbar search query. */
export function normalizeQuery(query) {
  return query.trim().toLowerCase();
}

export function buildShopNameMap(shops = []) {
  const map = {};
  shops.forEach((shop) => {
    if (shop?._id) map[String(shop._id)] = shop.name || "";
  });
  return map;
}

export function itemMatchesSearch(item, query, shopNameById = {}) {
  const q = normalizeQuery(query);
  if (!q) return true;

  const shopId = item.shop?._id ?? item.shop;
  const shopName =
    item.shopName ||
    shopNameById[String(shopId)] ||
    (typeof item.shop === "object" ? item.shop?.name : "") ||
    "";

  return (
    item.name?.toLowerCase().includes(q) ||
    item.category?.toLowerCase().includes(q) ||
    item.foodType?.toLowerCase().includes(q) ||
    shopName.toLowerCase().includes(q)
  );
}

export function shopMatchesSearch(shop, query) {
  const q = normalizeQuery(query);
  if (!q) return true;
  return shop.name?.toLowerCase().includes(q);
}
