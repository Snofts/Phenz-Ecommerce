import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    // 1. Get token from cookie (httpOnly + sameSite: lax + domain: .vercel.app)
    const token = req.cookies.token;

    if (!token) {
      return res.json({ success: false, message: "Not Authorised, Login again" });
    }

    // 2. Verify token signature
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.json({ success: false, message: "Session expired, login again" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.json({ success: false, message: "Invalid token" });
      }
      throw err;
    }

    // 3. Check if it's admin token (your current method)
    const expectedAdminToken = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;

    // For regular users: decoded = { id: "user_id" }
    // For admin: decoded = "admin@email.comsecretpassword" (string)
    if (typeof decoded === "string") {
      if (decoded !== expectedAdminToken) {
        return res.json({ success: false, message: "Not Authorised, Admin only" });
      }
    } else if (decoded.id) {
      // If it's a user token, reject
      return res.json({ success: false, message: "Not Authorised, Admin only" });
    } else {
      return res.json({ success: false, message: "Invalid token format" });
    }

    // 4. All good → proceed
    next();

  } catch (error) {
    console.log("Admin Auth Error:", error);
    return res.json({ success: false, message: "Authentication failed" });
  }
};

export default adminAuth;