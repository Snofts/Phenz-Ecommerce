// controllers/newsletterController.js
import newsletterModel from "../models/newsletterModel.js";

const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.json({ success: false, message: "Valid email required" });
    }

    // Prevent duplicates
    const exists = await newsletterModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Already subscribed" });
    }

    const newSubscriber = new newsletterModel({ email });
    await newSubscriber.save();

    res.json({ success: true, message: "Welcome to the Empire" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error" });
  }
};

export { subscribeNewsletter };