import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { HTTP_STATUS } from "../constants/httpStatus";

export const validate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors: result.error.issues?.map((err) => {
          return {
            field: err.path[0],
            message: err.message,
          };
        }),
      });
    }

    req.body = result.data;
    next();
  };
