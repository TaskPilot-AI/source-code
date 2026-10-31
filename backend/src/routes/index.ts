import { Router } from "express";
import documentRouter from "./v1/document.route";
import taskRouter from "./v1/tasks.route";
import employeeRouter from "./v1/employee.route";
import projectRouter from "./v1/project.route";
import userRouter from "./v1/user.route";
import { authenticate } from "../middlewares/auth_middleware";
import statusRouter from "./v1/status.route";
import recordingsRouter from "./v1/recordings.route";

const router = Router();

router.use("/documents", authenticate, documentRouter);
router.use("/tasks", authenticate, taskRouter);
router.use("/employees", authenticate, employeeRouter);
router.use("/projects", authenticate, projectRouter);
router.use("/admins", authenticate, userRouter);
router.use("/status", authenticate, statusRouter);
router.use("/recordings", authenticate, recordingsRouter);

export default router;
