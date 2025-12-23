import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config";

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, config.JWT_SECRET!, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
};

export const generateResetToken = (): { token: string; hashedToken: string } => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
};
