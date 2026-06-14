import { Router, type IRouter } from "express";
import { CompleteTaskBody } from "@workspace/game-core";
import { asyncHandler, sendData } from "../lib/envelope";
import { completeTask } from "../services/taskService";

const router: IRouter = Router();

router.post(
  "/complete",
  asyncHandler(async (req, res) => {
    const body = CompleteTaskBody.parse(req.body);
    const result = await completeTask(body.player, body.taskId, body.demoMode);
    sendData(res, result);
  }),
);

export default router;
