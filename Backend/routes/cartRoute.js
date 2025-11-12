import express from "express";
import {
  addToCart,
  updateCart,
  getUserCart,
} from "../controllers/cartController.js";
import auth from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/get", auth({ user: true }), getUserCart);
cartRouter.post("/add", auth({ user: true }), addToCart);
cartRouter.post("/update", auth({ user: true }), updateCart);

export default cartRouter;
