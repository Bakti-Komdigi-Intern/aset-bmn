const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "bakti_secret";

// Put a token here (from browser localStorage.token after login)
const token = process.env.TEST_TOKEN;

if (!token) {
  console.log("Set TEST_TOKEN env var to run.");
  process.exit(1);
}

try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log("VERIFIED OK:", decoded);
} catch (e) {
  console.log("VERIFY FAILED:", e.message);
}

