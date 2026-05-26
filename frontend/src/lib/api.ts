const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";

export const API = BASE_URL;

// ==============================
// TOKEN
// ==============================

export const getToken = () => {
  return localStorage.getItem("token");
};

// ==============================
// AUTH HEADERS
// ==============================

export const authHeaders = () => ({
  "Content-Type": "application/json",

  Authorization:
    `Bearer ${getToken()}`
});

// ==============================
// GET ASET
// ==============================

export const getAset =
  async () => {

    const res =
      await fetch(
        `${API}/aset`,
        {
          headers:
            authHeaders()
        }
      );

    return res.json();
  };