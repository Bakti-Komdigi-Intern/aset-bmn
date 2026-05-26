require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // Fail fast: kalau secret belum diset, token tidak akan pernah bisa diverifikasi dengan benar
  throw new Error("JWT_SECRET is not set in environment (.env).");
}

module.exports = {
  JWT_SECRET
};
