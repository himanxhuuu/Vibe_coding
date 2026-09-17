import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

function paramsFrom(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== "" && value !== "ALL")
  );
}

export async function getHealth() {
  const { data } = await client.get("/health");
  return data;
}

export async function getTasks(filters) {
  const { data } = await client.get("/tasks", { params: paramsFrom(filters) });
  return data;
}

export async function createTask(payload) {
  const { data } = await client.post("/tasks", payload);
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await client.put(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id) {
  await client.delete(`/tasks/${id}`);
}

export async function updateTaskStatus(id, status) {
  const { data } = await client.patch(`/tasks/${id}/status`, { status });
  return data;
}

export async function getUsers() {
  const { data } = await client.get("/users");
  return data;
}

export async function createUser(payload) {
  const { data } = await client.post("/users", payload);
  return data;
}

export async function getWorkloads() {
  const { data } = await client.get("/users/workload");
  return data;
}

export async function getProjects() {
  const { data } = await client.get("/projects");
  return data;
}

export async function getProjectMembers(projectId) {
  const { data } = await client.get(`/projects/${projectId}/members`);
  return data;
}

export async function addProjectMember(projectId, userId) {
  const { data } = await client.post(`/projects/${projectId}/members`, { userId });
  return data;
}

export async function removeProjectMember(projectId, userId) {
  await client.delete(`/projects/${projectId}/members/${userId}`);
}

export function getApiErrorMessage(error) {
  return error?.response?.data?.message || error?.message || "Something went wrong";
}
