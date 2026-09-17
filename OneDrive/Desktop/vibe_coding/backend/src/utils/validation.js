import { ApiError } from "./apiError.js";

export const priorities = ["LOW", "MEDIUM", "HIGH"];
export const statuses = ["TODO", "IN_PROGRESS", "DONE"];

export function requiredString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(400, `${field} is required`);
  }
  return value.trim();
}

export function optionalString(value, field) {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new ApiError(400, `${field} must be text`);
  }
  return value.trim();
}

export function validEnum(value, allowed, field) {
  if (!allowed.includes(value)) {
    throw new ApiError(400, `${field} must be one of: ${allowed.join(", ")}`);
  }
  return value;
}

export function validId(value, field = "id") {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, `${field} must be a positive integer`);
  }
  return id;
}

export function validDate(value, field = "dueDate") {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    throw new ApiError(400, `${field} must be a valid date`);
  }
  return date;
}

export function validateEmail(value) {
  const email = requiredString(value, "email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "email must be valid");
  }
  return email;
}

export function initialsFromName(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}
