import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/apiError.js";

export function notFound(req, res, next) {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(error, req, res, next) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "A record with this value already exists" });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Record not found" });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ message: "Related record does not exist" });
    }
  }

  console.error(error);
  return res.status(500).json({ message: "Unexpected server error" });
}
