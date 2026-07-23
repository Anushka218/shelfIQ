import axios from "axios";
import { mockShelf, mockShelfPersonalized, mockDemand, mockTrends } from "./mockData";

const USE_MOCK = false;
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export async function getShelf(region, userId = null) {
  if (USE_MOCK) {
    if (userId) return mockShelfPersonalized;
    return mockShelf;
  }

  const url = userId
    ? `${BASE_URL}/api/shelf/${region}?user_id=${userId}`
    : `${BASE_URL}/api/shelf/${region}`;
  const res = await axios.get(url);
  return res.data;
}

export async function getDemand(region) {
  if (USE_MOCK) return mockDemand;
  const res = await axios.get(`${BASE_URL}/api/demand/${region}`);
  return res.data;
}

export async function getTrends(region) {
  if (USE_MOCK) return mockTrends;
  const res = await axios.get(`${BASE_URL}/api/trends/${region}`);
  return res.data;
}

export async function getExplanation(region, productId, userId = null) {
  if (USE_MOCK) {
    return { region, product_id: productId, reasons: ["Trending in your area", "Good discount"] };
  }
  const url = userId
    ? `${BASE_URL}/api/shelf/explain/${region}/${productId}?user_id=${userId}`
    : `${BASE_URL}/api/shelf/explain/${region}/${productId}`;
  const res = await axios.get(url);
  return res.data;
}

export async function getSellerDashboard(region) {
  if (USE_MOCK) {
    return {
      region,
      catalog_gaps: [],
      pricing_opportunities: [],
      attribute_opportunities: [],
      summary: { total_insights: 0 },
    };
  }
  const res = await axios.get(`${BASE_URL}/seller/dashboard?region=${region}`);
  return res.data;
}

export async function searchProducts(query) {
  const res = await axios.get(`${BASE_URL}/api/search/?q=${encodeURIComponent(query)}`);
  return res.data;
}

export async function filterProducts(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const res = await axios.get(`${BASE_URL}/api/products/filter/?${params.toString()}`);
  return res.data;
}

export async function getPlatformAnalytics() {
  const res = await axios.get(`${BASE_URL}/api/analytics/api/`);
  return res.data;
}