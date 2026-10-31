import type { Request, Response, NextFunction } from "express";
import { createAdmin, login, findUserById } from "../services/user.service";
import { CreateAdminSchema, LoginSchema } from "../types";
import jwt from "jsonwebtoken";

// Environment variables should be properly set up
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const JWT_EXPIRES_IN = "1h";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

// Generate tokens
const generateTokens = (user: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

// Create admin controller
export const createAdminFun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = CreateAdminSchema.parse(req.body);

    const admin = await createAdmin(
      validatedData.name,
      validatedData.email,
      validatedData.accessToken || "",
      validatedData.password
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: admin.id,
      email: admin.email,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate")) {
      res.status(409).json({
        success: false,
        message: "Email already exists",
        error: error.message,
      });
    } else if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({
        success: false,
        message: "Invalid input data",
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};

// Login controller
export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = LoginSchema.parse(req.body);
    const { email, password } = validatedData;

    const admin = await login(email, password);

    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: admin.id,
      email: admin.email,
      role: "admin",
    });

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      data: {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid credentials") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    } else if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({
        success: false,
        message: "Invalid input data",
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};

// Refresh token controller
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({
      success: false,
      message: "Refresh token is required",
    });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      id: string;
    };
    const user = await findUserById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
      return;
    }

    const tokens = generateTokens({
      id: user.id || "",
      email: user.email || "",
      role: "admin",
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

// Logout controller
export const logoutAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  // In a real implementation, you would invalidate the refresh token
  // by adding it to a blacklist or removing it from the database

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await findUserById(userId!);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
