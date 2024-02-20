import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getLoggedInUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  getUserInfo,
  verifyAccount
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

// router.post("/register", upload.single("avatar"), registerUser);
router.post("/register",  registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", isLoggedIn, getLoggedInUserDetails);
router.post("/reset", forgotPassword);
router.post("/reset/:resetToken", resetPassword);
router.post("/verify/:verificationToken", verifyAccount);
router.post("/change-password", isLoggedIn, changePassword);
// router.put("/update/:id", isLoggedIn, upload.single("avatar"), updateUser);
router.put("/update/:id", isLoggedIn, updateUser);
router.post("/getUserInfo", isLoggedIn, getUserInfo);
router.post("/myOrders", isLoggedIn, getUserInfo);

export default router;
