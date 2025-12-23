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
