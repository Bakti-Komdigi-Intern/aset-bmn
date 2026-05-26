const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

module.exports = (req, res, next) => {
  try {
    // =========================
    // AMBIL HEADER
    // =========================
    const authHeader = req.headers.authorization;

    console.log("🪪 AUTH HEADER:", authHeader);

    // =========================
    // HEADER TIDAK ADA
    // =========================
    if (!authHeader) {
      console.log(
        "❌ AUTH HEADER MISSING. REQ HEADERS KEYS:",
        Object.keys(req.headers)
      );
      console.log(
        "❌ AUTH HEADER VALUE (raw):",
        req.headers
      );

      return res.status(401).json({
        message: "Token tidak ada"
      });
    }

    // =========================
    // FORMAT HARUS:
    // Bearer TOKEN
    // =========================
    const split = authHeader.split(" ");

    if (split.length !== 2 || split[0] !== "Bearer") {
      return res.status(401).json({
        message: "Format token salah"
      });
    }

    const token = split[1];

    console.log("🔑 TOKEN MASUK:", token);

    // =========================
    // VERIFY JWT
    // =========================
    const decoded = jwt.verify(token, JWT_SECRET);

    console.log("✅ TOKEN VALID:", decoded);

    // =========================
    // SIMPAN USER
    // =========================
    req.user = decoded;

    next();
  } catch (err) {
    const name =
      err && err.name
        ? err.name
        : "JWT_ERROR";
    const message =
      err && err.message
        ? err.message
        : String(err);

    console.log("❌ JWT ERROR NAME:", name);
    console.log("❌ JWT ERROR MESSAGE:", message);
    console.log("❌ JWT TOKEN LENGTH:", typeof token === "string" ? token.length : "n/a");

    return res.status(401).json({
      message: "Token tidak valid"
    });
  }
};
