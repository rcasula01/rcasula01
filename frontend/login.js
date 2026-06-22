let loginAttempts = 0;

const form = document.getElementById("loginForm");
const errorBox = document.getElementById("loginError");
const username = document.getElementById("username");
const password = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");

const API_BASE = window.API_BASE || "http://localhost:4000";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = username.value;
  const pass = password.value;
  const remember = rememberMe.checked;

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: user, password: pass })
    });

    const data = await response.json();

    if (!response.ok) {
      loginAttempts++;
      errorBox.textContent =
        data.error || "Invalid username or password";
      errorBox.classList.add("show");

      if (loginAttempts >= 3) {
        alert("Too many failed attempts. Try again later.");
        loginAttempts = 0;
      }
      return;
    }

    loginAttempts = 0;
    errorBox.classList.remove("show");

    // Store JWT token
    localStorage.setItem("authToken", data.token);

    // Store user info
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("username", data.username);

    // Store username if "Remember me" is checked
    if (remember) {
      localStorage.setItem("adminUsername", user);
    } else {
      localStorage.removeItem("adminUsername");
    }

    // Redirect to appropriate page
    window.location.href = data.redirectUrl;
    console.log("✅ Login Successful");
  } catch (error) {
    console.error("Login error:", error);
    loginAttempts++;
    errorBox.classList.add("show");

    if (loginAttempts >= 3) {
      alert("Too many failed attempts");
      loginAttempts = 0;
    }
  }
});

document.getElementById("forgotPassword").onclick = (e) => {
  e.preventDefault();
  alert(
    "Contact system administrator: support@blinkfind.com or (856) 452 1688"
  );
};

window.onload = () => {
  const saved = localStorage.getItem("adminUsername");
  if (saved) {
    username.value = saved;
    rememberMe.checked = true;
  }
};