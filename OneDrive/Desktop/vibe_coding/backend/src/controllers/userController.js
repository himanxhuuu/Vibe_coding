import * as userService from "../services/userService.js";

export const listUsers = async (req, res) => {
  res.json(await userService.listUsers());
};

export const getUser = async (req, res) => {
  res.json(await userService.getUser(req.params.id));
};

export const createUser = async (req, res) => {
  res.status(201).json(await userService.createUser(req.body));
};

export const updateUser = async (req, res) => {
  res.json(await userService.updateUser(req.params.id, req.body));
};

export const deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(204).send();
};

export const workloads = async (req, res) => {
  res.json(await userService.getWorkloads());
};
