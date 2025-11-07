import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    // 1. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.json({
          success: false,
          message: "Session expired, login again",
        });
      }
      return res.json({ success: false, message: "Invalid token" });
    }

    // 2. Handle BOTH user and admin tokens
    if (typeof decoded === "string") {
      // This is ADMIN token
      const expected = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
      if (decoded !== expected) {
        return res.json({ success: false, message: "Invalid admin token" });
      }
      // Set a flag so you know it's admin
      req.body.userId = "admin"; // or req.body.isAdmin = true
      req.body.isAdmin = true;
    } else if (decoded.id) {
      // This is REGULAR USER token
      req.body.userId = decoded.id;
      req.body.isAdmin = false;
    } else {
      return res.json({ success: false, message: "Invalid token format" });
    }

    // 3. Proceed
    next();
  } catch (error) {
    console.log("authUser Error:", error);
    return res.json({ success: false, message: "Authentication failed" });
  }
};

export default authUser;
