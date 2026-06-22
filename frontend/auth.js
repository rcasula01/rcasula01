const API_BASE = window.API_BASE || "http://localhost:4000";

function getAuthToken() {
  return localStorage.getItem("authToken");
}

function getUserRole() {
  return localStorage.getItem("userRole");
}

function getUsername() {
  return localStorage.getItem("username");
}

async function verifyToken() {
  const token = getAuthToken();

  if (!token) {
    window.location.href = "./login.html";
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      window.location.href = "./login.html";
      return false;
    }

    const data = await response.json();
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    window.location.href = "./login.html";
    return false;
  }
}

function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("username");
  localStorage.removeItem("adminUsername");
  window.location.href = "./login.html";
}

// Add auth header to all fetch requests
const originalFetch = window.fetch;
window.fetch = function (...args) {
  const token = getAuthToken();
  if (token && typeof args[1] === "object") {
    args[1].headers = args[1].headers || {};
    args[1].headers["Authorization"] = `Bearer ${token}`;
  }
  return originalFetch(...args);
};

// Verify token on page load
window.addEventListener("load", verifyToken);