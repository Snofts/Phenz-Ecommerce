import jwt from "jsonwebtoken";

const adminCheckAuth = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "No token" });
    }

    // 1. Verify token signature AND capture decoded payload
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    // 2. Check if it's actually an ADMIN token
    const expectedAdminToken =
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;

    // Admin token = string (e.g. "admin@phenz.comsecret123")
    // User token = object { id: "671f..." }
    if (typeof decoded === "string" && decoded === expectedAdminToken) {
      return res.json({ success: true, message: "Admin authenticated" });
    }

    // If it's a user token or anything else → reject
    return res.json({ success: false, message: "Not an admin" });
  } catch (error) {
    console.log("adminCheckAuth Error:", error);
    return res.json({ success: false, message: "Authentication failed" });
  }
};

export default adminCheckAuth;
