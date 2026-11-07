import jwt from "jsonwebtoken";

export default function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: payload.adminId };
    next();
  } catch {
    return res.status(401).json({ message: "Session is invalid or expired. Please sign in again." });
  }
}
