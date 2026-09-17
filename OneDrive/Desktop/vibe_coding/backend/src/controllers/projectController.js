import * as projectService from "../services/projectService.js";

export const listProjects = async (req, res) => {
  res.json(await projectService.listProjects());
};

export const getProject = async (req, res) => {
  res.json(await projectService.getProject(req.params.id));
};

export const createProject = async (req, res) => {
  res.status(201).json(await projectService.createProject(req.body));
};

export const updateProject = async (req, res) => {
  res.json(await projectService.updateProject(req.params.id, req.body));
};

export const deleteProject = async (req, res) => {
  await projectService.deleteProject(req.params.id);
  res.status(204).send();
};

export const listMembers = async (req, res) => {
  res.json(await projectService.listMembers(req.params.id));
};

export const addMember = async (req, res) => {
  res.status(201).json(await projectService.addMember(req.params.id, req.body));
};

export const removeMember = async (req, res) => {
  await projectService.removeMember(req.params.id, req.params.userId);
  res.status(204).send();
};
