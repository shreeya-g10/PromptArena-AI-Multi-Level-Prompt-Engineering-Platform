import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "No token" });
    }

    const decoded = jwt.verify(token, "secret123");

    req.user = decoded;

    next();

  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};