import { prisma } from "../utils/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { priorities, requiredString, statuses, validDate, validEnum, validId } from "../utils/validation.js";

const taskInclude = {
  project: true,
  assignedUser: true
};

async function ensureAssignment(projectId, assignedUserId) {
  const [project, user, member] = await Promise.all([
    prisma.project.findUnique({ where: { id: projectId } }),
    prisma.user.findUnique({ where: { id: assignedUserId } }),
    prisma.projectMember.findUnique({ where: { projectId_userId: { projectId, userId: assignedUserId } } })
  ]);

  if (!project) throw new ApiError(400, "projectId does not exist");
  if (!user) throw new ApiError(400, "assignedUserId does not exist");
  if (!member) throw new ApiError(400, "Assigned user must be a member of the selected project");
}

export async function listTasks(query) {
  const where = {};
  if (query.priority) where.priority = validEnum(query.priority, priorities, "priority");
  if (query.status) where.status = validEnum(query.status, statuses, "status");
  if (query.projectId) where.projectId = validId(query.projectId, "projectId");
  if (query.assignedUserId) where.assignedUserId = validId(query.assignedUserId, "assignedUserId");

  return prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }]
  });
}

export async function getTask(id) {
  const task = await prisma.task.findUnique({ where: { id: validId(id) }, include: taskInclude });
  if (!task) throw new ApiError(404, "Task not found");
  return task;
}

function taskPayload(data, partial = false) {
  const payload = {};
  const requireField = (field) => {
    if (!partial && data[field] === undefined) throw new ApiError(400, `${field} is required`);
  };

  requireField("title");
  requireField("description");
  requireField("priority");
  requireField("status");
  requireField("dueDate");
  requireField("projectId");
  requireField("assignedUserId");

  if (data.title !== undefined) payload.title = requiredString(data.title, "title");
  if (data.description !== undefined) payload.description = requiredString(data.description, "description");
  if (data.priority !== undefined) payload.priority = validEnum(data.priority, priorities, "priority");
  if (data.status !== undefined) payload.status = validEnum(data.status, statuses, "status");
  if (data.dueDate !== undefined) payload.dueDate = validDate(data.dueDate);
  if (data.projectId !== undefined) payload.projectId = validId(data.projectId, "projectId");
  if (data.assignedUserId !== undefined) payload.assignedUserId = validId(data.assignedUserId, "assignedUserId");
  return payload;
}

export async function createTask(data) {
  const payload = taskPayload(data);
  await ensureAssignment(payload.projectId, payload.assignedUserId);
  return prisma.task.create({ data: payload, include: taskInclude });
}

export async function updateTask(id, data) {
  const current = await getTask(id);
  const payload = taskPayload(data, true);
  if (Object.keys(payload).length === 0) throw new ApiError(400, "No valid fields provided");

  const nextProjectId = payload.projectId || current.projectId;
  const nextAssignedUserId = payload.assignedUserId || current.assignedUserId;
  await ensureAssignment(nextProjectId, nextAssignedUserId);

  return prisma.task.update({ where: { id: current.id }, data: payload, include: taskInclude });
}

export async function deleteTask(id) {
  return prisma.task.delete({ where: { id: validId(id) } });
}

export async function updateTaskStatus(id, data) {
  const status = validEnum(data.status, statuses, "status");
  await getTask(id);
  return prisma.task.update({
    where: { id: validId(id) },
    data: { status },
    include: taskInclude
  });
}
