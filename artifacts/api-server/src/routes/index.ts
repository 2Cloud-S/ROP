import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contentRouter from "./content";
import sessionRouter from "./session";
import plantsRouter from "./plants";
import tasksRouter from "./tasks";
import discoveryRouter from "./discovery";
import battleRouter from "./battle";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/content", contentRouter);
router.use("/session", sessionRouter);
router.use("/plants", plantsRouter);
router.use("/tasks", tasksRouter);
router.use("/discover", discoveryRouter);
router.use("/battle", battleRouter);

export default router;
