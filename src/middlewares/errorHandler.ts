import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "fail",
      message: "Validation error",
      errors,
    });
  }

  if (err.name === "ZodError" && err.errors) {
    const formattedErrors = err.errors.map((e: any) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "fail",
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message:
      config.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message || "Internal server error",
  });
};
