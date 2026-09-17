import { prisma } from "../utils/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { optionalString, requiredString, validId } from "../utils/validation.js";

const projectInclude = {
  members: {
    include: { user: true },
    orderBy: { user: { name: "asc" } }
  },
  tasks: {
    include: { assignedUser: true },
    orderBy: { dueDate: "asc" }
  }
};

export async function listProjects() {
  return prisma.project.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { tasks: true, members: true } } }
  });
}

export async function getProject(id) {
  const project = await prisma.project.findUnique({ where: { id: validId(id) }, include: projectInclude });
  if (!project) throw new ApiError(404, "Project not found");
  return project;
}

export async function createProject(data) {
  return prisma.project.create({
    data: {
      name: requiredString(data.name, "name"),
      description: optionalString(data.description, "description") || ""
    }
  });
}

export async function updateProject(id, data) {
  const update = {};
  if (data.name !== undefined) update.name = requiredString(data.name, "name");
  if (data.description !== undefined) update.description = optionalString(data.description, "description") || "";
  if (Object.keys(update).length === 0) throw new ApiError(400, "No valid fields provided");
  return prisma.project.update({ where: { id: validId(id) }, data: update });
}

export async function deleteProject(id) {
  return prisma.project.delete({ where: { id: validId(id) } });
}

export async function listMembers(projectId) {
  await getProject(projectId);
  const members = await prisma.projectMember.findMany({
    where: { projectId: validId(projectId, "projectId") },
    include: { user: true },
    orderBy: { user: { name: "asc" } }
  });
  return members.map((member) => member.user);
}

export async function addMember(projectId, data) {
  const project = validId(projectId, "projectId");
  const user = validId(data.userId, "userId");
  await Promise.all([
    prisma.project.findUniqueOrThrow({ where: { id: project } }),
    prisma.user.findUniqueOrThrow({ where: { id: user } })
  ]);

  return prisma.projectMember.create({
    data: { projectId: project, userId: user },
    include: { user: true, project: true }
  });
}

export async function removeMember(projectId, userId) {
  return prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId: validId(projectId, "projectId"),
        userId: validId(userId, "userId")
      }
    }
  });
}
