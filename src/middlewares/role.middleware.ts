import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "../utils/AppError";

export const restrictTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return next(new AppError("User not authenticated", HTTP_STATUS.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    next();
  };
