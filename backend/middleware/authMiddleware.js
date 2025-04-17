// backend/middleware/authMiddleware.js
const admin = require("../config/firebase");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erreur vérif token Firebase :", error);
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};

module.exports = authenticateToken;
