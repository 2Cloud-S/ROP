import { Router, type IRouter } from "express";
import { CreateSessionBody } from "@workspace/game-core";
import { asyncHandler, sendData } from "../lib/envelope";
import { createSession } from "../services/sessionService";

const router: IRouter = Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = CreateSessionBody.parse(req.body ?? {});
    const player = await createSession(body.id);
    sendData(res, { player }, 201);
  }),
);

export default router;
