import { prisma } from "../utils/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { initialsFromName, optionalString, requiredString, validateEmail, validId } from "../utils/validation.js";

const includeTasks = {
  assignedTasks: {
    select: { id: true, title: true, status: true, projectId: true }
  }
};

export async function listUsers() {
  return prisma.user.findMany({ orderBy: { name: "asc" } });
}

export async function getUser(id) {
  const user = await prisma.user.findUnique({ where: { id: validId(id) }, include: includeTasks });
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

export async function createUser(data) {
  const name = requiredString(data.name, "name");
  const email = validateEmail(data.email);
  const avatarInitials = optionalString(data.avatarInitials, "avatarInitials") || initialsFromName(name);

  return prisma.user.create({ data: { name, email, avatarInitials } });
}

export async function updateUser(id, data) {
  const update = {};
  if (data.name !== undefined) update.name = requiredString(data.name, "name");
  if (data.email !== undefined) update.email = validateEmail(data.email);
  if (data.avatarInitials !== undefined) update.avatarInitials = requiredString(data.avatarInitials, "avatarInitials");

  if (Object.keys(update).length === 0) throw new ApiError(400, "No valid fields provided");
  return prisma.user.update({ where: { id: validId(id) }, data: update });
}

export async function deleteUser(id) {
  return prisma.user.delete({ where: { id: validId(id) } });
}

export async function getWorkloads() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          assignedTasks: { where: { status: "IN_PROGRESS" } }
        }
      }
    }
  });

  return users.map((user) => {
    const inProgressCount = user._count.assignedTasks;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarInitials: user.avatarInitials,
      inProgressCount,
      isOverloaded: inProgressCount > 5
    };
  });
}
