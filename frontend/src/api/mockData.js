export const mockShelf = {
  region: "Lucknow",
  user_id: null,
  alpha: 1.0,
  personalization_applied: false,
  shelf_order: ["Kurtas", "Ethnic Sets", "Jackets", "Sneakers", "Denim"],
};

export const mockShelfPersonalized = {
  region: "Lucknow",
  user_id: "demo_user_premium_lucknow",
  alpha: 0.65,
  personalization_applied: true,
  shelf_order: ["Ethnic Sets", "Kurtas", "Jackets", "Sneakers", "Denim"],
};

export const mockDemand = {
  region: "Lucknow",
  categories: [
    { category: "Kurtas", count: 359 },
    { category: "Ethnic Sets", count: 98 },
    { category: "Jackets", count: 62 },
  ],
};

export const mockTrends = {
  region: "Lucknow",
  trends: [
    { category: "Kurtas", score: 8.4, growth_rate: 0.32 },
    { category: "Ethnic Sets", score: 5.1, growth_rate: 0.10 },
    { category: "Jackets", score: 3.2, growth_rate: -0.05 },
  ],
};