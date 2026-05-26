// api.js - Centralized API Utility

const API_BASE = "/api/v1";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Handle unauthorized
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("doctorId");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("doctorId");
        window.location.href = "/auth.html";
        throw new Error("Unauthorized");
      }

      let errorMessage = "API Error";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If it's not JSON, read text
        errorMessage = (await response.text()) || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Handle JSON and plain-text success bodies.
    const text = await response.text();
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, body) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
  patch: (endpoint) => request(endpoint, { method: "PATCH" }),
};
