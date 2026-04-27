const BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Core fetch wrapper with auth token and error handling
 */
async function request(path, options = {}) {
  const token = localStorage.getItem("sakina_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ================= AUTH =================
export const loginUser = (email, password) =>
  request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerUser = (name, email, password) =>
  request("/users/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const getProfile = () => request("/users/profile");

// ================= MOODS =================
export const createMood = (moodLevel, note) =>
  request("/moods", {
    method: "POST",
    body: JSON.stringify({ moodLevel, note }),
  });

export const getMoods = (page = 1, limit = 30) =>
  request(`/moods?page=${page}&limit=${limit}`);

// ================= SURVEYS =================
export const createSurvey = (surveyData) =>
  request("/surveys", {
    method: "POST",
    body: JSON.stringify(surveyData),
  });

export const getSurvey = () => request("/surveys");

// ================= EXERCISES =================
export const getExercises = () => request("/exercises");

// ================= MESSAGES =================
export const sendMessage = (content) =>
  request("/messages", {
    method: "POST",
    body: JSON.stringify({ content }),
  });

export const getMessages = () => request("/messages");

