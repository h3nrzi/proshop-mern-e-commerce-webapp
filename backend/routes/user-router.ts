import express from "express";
import * as authController from "../controllers/auth-controller";
import * as userController from "../controllers/user-controller";
import * as auth from "../middlewares/auth";
import catchAsync from "../middlewares/catchAsync";
const router = express.Router();

router.post("/register", catchAsync(authController.register));
router.post("/auth", catchAsync(authController.login));
router.post("/logout", catchAsync(authController.logout));

/////////////////// Private
router.use(catchAsync(auth.protect));

router.get("/profile", catchAsync(userController.getUserProfile));
router.patch("/profile", catchAsync(userController.updateUserProfile));

/////////////////// Admin
router.use(catchAsync(auth.admin));

router.get("/", catchAsync(userController.getAllUsers));
router.get("/:id", catchAsync(userController.getUser));
router.patch("/:id", catchAsync(userController.updateUser));
router.delete("/:id", catchAsync(userController.deleteUser));

export default router;
