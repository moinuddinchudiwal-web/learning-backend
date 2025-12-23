import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getMe,
  logout,
  refreshToken,
  resetPassword,
  signin,
  signup,
  updateProfile,
} from "../controllers/user.controller";
import { protect } from "../middlewares/user.middleware";
import { validate } from "../middlewares/validate.middleware";
import { catchAsync } from "../utils/catchAsync";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
  updateProfileSchema,
} from "../validations/user.validation";

const router = Router();

router.post("/signup", validate(signupSchema), catchAsync(signup));
router.post("/signin", validate(signinSchema), catchAsync(signin));
router.get("/me", protect, catchAsync(getMe));
router.patch(
  "/update-profile",
  protect,
  validate(updateProfileSchema),
  catchAsync(updateProfile)
);
router.patch(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  catchAsync(changePassword)
);
router.post("/logout", protect, catchAsync(logout));
router.post("/refresh-token", catchAsync(refreshToken));
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  catchAsync(forgotPassword)
);
router.post("/reset-password", validate(resetPasswordSchema), catchAsync(resetPassword));

export default router;
