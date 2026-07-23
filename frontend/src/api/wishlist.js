const STORAGE_KEY = "shelfiq_wishlist";

function getWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isWishlisted(productId) {
  return getWishlist().includes(productId);
}

export function toggleWishlist(productId) {
  const current = getWishlist();
  const updated = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated.includes(productId);
}