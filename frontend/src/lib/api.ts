const BASE_URL = "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("token");
}

export async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Terjadi kesalahan server");
  }

  return res.json();
}

export const api = {
  // ── Auth ──────────────────────────────────────────────────
  login: (username: string, password: string) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, password: string) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  // ── Survey ────────────────────────────────────────────────
  submitSurvey: (data: object) =>
    request("/survey/submit", { method: "POST", body: JSON.stringify(data) }),

  getSurveyHistory: (email: string) =>
    request(`/survey/history/${email}`),

  getMyHistory: () =>
    request("/survey/my-history"),

  getAllSurveys: () => request("/survey/all"),

  // ── Dataset & Training ────────────────────────────────────
  uploadDataset: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const token = getToken();
    return fetch(`${BASE_URL}/dataset/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then((r) => r.json());
  },

  listDatasets: () => request("/dataset/list"),

  startTraining: (payload: object) =>
    request("/training/start", { method: "POST", body: JSON.stringify(payload) }),

  getModels: () => request("/training/models"),

  predict: (modelId: string, inputData: object) =>
    request("/prediction/predict", {
      method: "POST",
      body: JSON.stringify({ model_id: modelId, input_data: inputData }),
    }),
};