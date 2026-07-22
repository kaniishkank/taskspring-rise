import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Global Error Handler] Caught error on ${req.method} ${req.url}:`, err);

  // Handle Prisma Database Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[]) || ["field"];
      return res.status(409).json({ error: `A record with this ${target.join(", ")} already exists.` });
    }
    // P2025: Record not found
    if (err.code === "P2025") {
      return res.status(404).json({ error: "The requested record was not found." });
    }
  }

  // Handle Generic Errors (e.g., Unhandled Rejections not from Prisma)
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected internal server error occurred.";

  res.status(statusCode).json({ error: message });
};
