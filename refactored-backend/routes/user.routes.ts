import express from "express";
import { container } from "../core/container";
import { UserController } from "../modules/user";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const controller = container.resolve(UserController);
    const data = await controller.register(req.body);
    return res.status(201).json(data);
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const controller = container.resolve(UserController);
    const data = await controller.login(req.body);
    return res.json(data);
  } catch (err) {
    return next(err);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const controller = container.resolve(UserController);
    const data = await controller.getAll();
    return res.json(data);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const controller = container.resolve(UserController);
    const data = await controller.getById(req.params.id);
    return res.json(data);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const controller = container.resolve(UserController);
    const data = await controller.update(req.params.id, req.body);
    return res.json(data);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const controller = container.resolve(UserController);
    await controller.delete(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

export default router;
