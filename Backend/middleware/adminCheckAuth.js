import jwt from "jsonwebtoken";

const adminCheckAuth = (req, res) => {
  try {
    const token = req.cookies.admin_token; // read cookie
    if (!token) return res.json({ success: false, message: "No token, login again" });
    console.log(req.body);

    // verify JWT
    jwt.verify(token, process.env.JWT_SECRET);

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminCheckAuth;