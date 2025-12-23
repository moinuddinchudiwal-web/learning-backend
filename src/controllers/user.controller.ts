import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { HTTP_STATUS } from "../constants/httpStatus";
import User from "../models/User";
import { AppError } from "../utils/AppError";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", HTTP_STATUS.CONFLICT));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "user",
  });

  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.status(HTTP_STATUS.CREATED).json({
    message: "User registered successfully",
    accessToken,
    refreshToken,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED));
  }

  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.status(HTTP_STATUS.OK).json({
    message: "Login successful",
    accessToken,
    refreshToken,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};

export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;

  res.status(HTTP_STATUS.OK).json({
    message: "User fetched successfully",
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(HTTP_STATUS.OK).json({
    message: "Profile updated successfully",
    data: {
      id: updatedUser?._id,
      firstName: updatedUser?.firstName,
      lastName: updatedUser?.lastName,
      email: updatedUser?.email,
      role: updatedUser?.role,
    },
  });
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const { currentPassword, newPassword } = req.body;

  const dbUser = await User.findById(user._id).select("+password");
  if (!dbUser) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", HTTP_STATUS.UNAUTHORIZED);
  }

  dbUser.password = await bcrypt.hash(newPassword, 10);
  await dbUser.save();

  res.status(HTTP_STATUS.OK).json({
    message: "Password changed successfully",
  });
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  await User.findByIdAndUpdate(user._id, {
    refreshToken: null,
  });

  res.status(HTTP_STATUS.OK).json({
    message: "Logout successful",
  });
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token required", HTTP_STATUS.UNAUTHORIZED);
  }

  const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET!) as {
    userId: string;
  };

  const user = await User.findById(decoded.userId).select("+refreshToken");
  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token", HTTP_STATUS.UNAUTHORIZED);
  }

  const newAccessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  res.status(HTTP_STATUS.OK).json({
    accessToken: newAccessToken,
  });
};
