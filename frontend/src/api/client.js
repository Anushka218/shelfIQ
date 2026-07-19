import axios from "axios";
import { mockShelf, mockShelfPersonalized, mockDemand, mockTrends } from "./mockData";
const USE_MOCK = true; // flip to false later when the real backend is ready
const BASE_URL = "http://127.0.0.1:8000"; // Person A's backend address

export async function getShelf(region, userId = null) {
  if (USE_MOCK) {
    if (userId) return mockShelfPersonalized;
    return mockShelf;
  }const url = userId
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