import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import { HTTP_STATUS } from "../constants/httpStatus";
import User from "../models/User";
import { AppError } from "../utils/AppError";

interface DecodedToken extends JwtPayload {
  userId: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in", HTTP_STATUS.UNAUTHORIZED));
    }

    const decoded = jwt.verify(token, config.JWT_SECRET!) as DecodedToken;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError("User no longer exists", HTTP_STATUS.UNAUTHORIZED));
    }

    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};
