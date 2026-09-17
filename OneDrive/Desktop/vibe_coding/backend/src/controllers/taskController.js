import * as taskService from "../services/taskService.js";

export const listTasks = async (req, res) => {
  res.json(await taskService.listTasks(req.query));
};

export const getTask = async (req, res) => {
  res.json(await taskService.getTask(req.params.id));
};

export const createTask = async (req, res) => {
  res.status(201).json(await taskService.createTask(req.body));
};

export const updateTask = async (req, res) => {
  res.json(await taskService.updateTask(req.params.id, req.body));
};

export const deleteTask = async (req, res) => {
  await taskService.deleteTask(req.params.id);
  res.status(204).send();
};

export const updateTaskStatus = async (req, res) => {
  res.json(await taskService.updateTaskStatus(req.params.id, req.body));
};
