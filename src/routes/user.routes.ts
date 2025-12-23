import { Router } from "express";
import {
  changePassword,
  getMe,
  logout,
  refreshToken,
  signin,
  signup,
  updateProfile,
} from "../controllers/user.controller";
import { protect } from "../middlewares/user.middleware";
import { validate } from "../middlewares/validate.middleware";
import { catchAsync } from "../utils/catchAsync";
import {
  changePasswordSchema,
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

export default router;
