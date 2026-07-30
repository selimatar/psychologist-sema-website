const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const TOKEN_KEY = "admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `Request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function apiFetch(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth) {
    clearToken();
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

export function login(email, password) {
  return apiFetch("/api/auth/login", { method: "POST", body: { email, password }, auth: false });
}

export function listBookingRequests(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch(`/api/admin/booking-requests${qs}`);
}

export function approveBookingRequest(id) {
  return apiFetch(`/api/admin/booking-requests/${id}/approve`, { method: "POST" });
}

export function rejectBookingRequest(id, reason) {
  return apiFetch(`/api/admin/booking-requests/${id}/reject`, { method: "POST", body: { reason } });
}

export function listReservations() {
  return apiFetch("/api/admin/reservations");
}

export function createReservation(payload) {
  return apiFetch("/api/admin/reservations", { method: "POST", body: payload });
}

export function rescheduleReservation(id, payload) {
  return apiFetch(`/api/admin/reservations/${id}`, { method: "PATCH", body: payload });
}

export function cancelReservation(id) {
  return apiFetch(`/api/admin/reservations/${id}`, { method: "DELETE" });
}

export { ApiError };
