import jwt from "jsonwebtoken";

export const userCheckAuth = async (req, res) => {
  const token = req.cookies.user_token;
  if (!token) {
    return res.json({ success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (err) {
    res.json({ success: false });
  }
};
