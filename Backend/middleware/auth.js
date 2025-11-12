// middleware/auth.js
import jwt from "jsonwebtoken";

const auth = (options = {}) => {
  return async (req, res, next) => {
    try {
      // 1. READ FROM HEADER ONLY
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.json({ success: false, message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.json({ success: false, message: "Invalid token format" });
      }

      // 2. VERIFY TOKEN
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // 3. ROLE CHECKS
      if (options.admin && decoded.role !== "admin") {
        return res.json({ success: false, message: "Admin access denied" });
      }

      if (options.user && decoded.role !== "user") {
        return res.json({ success: false, message: "User access required" });
      }

      // 4. OWN RESOURCE CHECK
      if (options.own && decoded.id !== req.params.id && decoded.role !== "admin") {
        return res.json({ success: false, message: "You can only modify your own data" });
      }

      next();
    } catch (error) {
      console.log("Auth Error:", error.message);

      if (error.name === "TokenExpiredError") {
        return res.json({ success: false, message: "Token expired, login again" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.json({ success: false, message: "Invalid token" });
      }

      return res.json({ success: false, message: "Authentication failed" });
    }
  };
};

// SPECIAL: Check auth status (for frontend auto-login)
auth.check = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.json({ success: false, message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.json({
      success: true,
      user: {
        role: decoded.role,
        email: decoded.email,
        id: decoded.id || null,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default auth;