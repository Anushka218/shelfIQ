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

export async function getExplanation(region, category) {
  if (USE_MOCK) {
    return { region, category, explanation: `${category} is trending in ${region} (mock explanation).` };
  }
  const res = await axios.get(`${BASE_URL}/api/explain/${region}/${category}`);
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