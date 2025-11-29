import express from "express";
import { container } from "../core/container";
import { ExampleController } from "../modules/example";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const controller = container.resolve(ExampleController);
    const data = await controller.getAll();
    return res.json(data);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const controller = container.resolve(ExampleController);
    const data = await controller.getById(req.params.id);
    return res.json(data);
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const controller = container.resolve(ExampleController);
    const data = await controller.create(req.body);
    return res.status(201).json(data);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const controller = container.resolve(ExampleController);
    const data = await controller.update(req.params.id, req.body);
    return res.json(data);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const controller = container.resolve(ExampleController);
    await controller.delete(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

export default router;
