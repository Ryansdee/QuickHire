const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authenticateToken = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("QuickHire API running ✅");
});

app.get("/secure", authenticateToken, (req, res) => {
  res.send(`Utilisateur connecté : ${req.user.email}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});
