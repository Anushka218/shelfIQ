import axios from "axios";

import {
  mockShelf,
  mockShelfPersonalized,
  mockDemand,
  mockTrends,
} from "./mockData";

const USE_MOCK = false;

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("shelfiq_token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function getShelf(region, userId = null) {
  if (USE_MOCK) {
    if (userId) return mockShelfPersonalized;
    return mockShelf;
  }

  const res = await axios.get(
    `${BASE_URL}/api/shelf/user/shelf/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return res.data;
}

export async function getDemand(region) {
  if (USE_MOCK) return mockDemand;

  const res = await axios.get(
    `${BASE_URL}/api/demand/${region}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return res.data;
}

export async function getTrends(region) {
  if (USE_MOCK) return mockTrends;

  const res = await axios.get(
    `${BASE_URL}/api/trends/${region}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return res.data;
}

export async function getExplanation(
  region,
  productId,
  userId = null
) {
  if (USE_MOCK) {
    return {
      region,
      product_id: productId,
      reasons: [
        "Trending in your area",
        "Good discount",
      ],
    };
  }

  const res = await axios.get(
    `${BASE_URL}/api/shelf/user/shelf/explain/${productId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return res.data;
}

export async function getSellerDashboard(region) {
  if (USE_MOCK) {
    return {
      region,
      catalog_gaps: [],
      pricing_opportunities: [],
      attribute_opportunities: [],
      summary: {
        total_insights: 0,
      },
    };
  }

  const res = await axios.get(
    `${BASE_URL}/seller/dashboard`,
    {
      params: {
        region,
      },
      headers: getAuthHeaders(),
    }
  );

  return res.data;
}

export async function searchProducts(query) {
  const res = await axios.get(
    `${BASE_URL}/api/search/`,
    {
      params: {
        q: query,
      },
    }
  );

  return res.data;
}

export async function filterProducts(filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const res = await axios.get(
    `${BASE_URL}/api/products/filter/?${params.toString()}`
  );

  return res.data;
}

export async function getPlatformAnalytics() {
  const res = await axios.get(
    `${BASE_URL}/api/analytics/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return res.data;
}

export async function registerUser({
  name,
  email,
  password,
  region,
  gender,
}) {
  const res = await axios.post(
    `${BASE_URL}/auth/register`,
    {
      name,
      email,
      password,
      region,
      gender,
    }
  );

  return res.data;
}

export async function loginUser(email, password) {
  const res = await axios.post(
    `${BASE_URL}/auth/login`,
    {
      email,
      password,
    }
  );

  return res.data;
}