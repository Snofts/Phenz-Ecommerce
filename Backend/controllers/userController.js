import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "./../models/userModel.js";
import jwt from "jsonwebtoken";

// Unified token creation
const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Helper to get cookie domain
const getCookieDomain = () => {
  if (process.env.NODE_ENV === "production") {
    return "vercel.app";
  }
  return undefined; // localhost
};

// Route for userLogin
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = createToken({
      id: user._id,
      role: "user",
      email: user.email,
    });

    // THEN SEND RESPONSE
    return res.json({ success: true, message: "Login successful", token, user: {
        id: user._id,
        name: user.name,
        email: user.email,
      } });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checking if user already exist or not
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "User already exist" });
    }

    // Vaidating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken({
      id: user._id,
      role: "user",
      email: user.email,
    });

    // ONE RESPONSE
    return res.json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Route for adminLogin
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = createToken({
        role: "admin",
        email: email,
      });

      return res.json({
        success: true,
        message: "Admin login successful",
        token,
        admin: { email },
      });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// User Logout route controller
const logoutUser = (req, res) => {
  try {
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Admin Logout route controller
const logoutAdmin = (req, res) => {
  try {
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, logoutUser, logoutAdmin };
