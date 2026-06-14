import { Router, type IRouter } from "express";
import { z } from "zod";
import { PlayerSaveSchema } from "@workspace/game-core";
import { asyncHandler, sendData } from "../lib/envelope";
import { discover } from "../services/discoveryService";
import { applyMilestones } from "../lib/milestones";

const DiscoverBody = z.object({
  player: PlayerSaveSchema,
  demoMode: z.boolean().default(false),
});

const router: IRouter = Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = DiscoverBody.parse(req.body);
    const result = await discover(body.player, body.demoMode);
    const m = await applyMilestones(result.player, body.demoMode);
    sendData(res, {
      ...result,
      player: m.player,
      milestoneUnlocks: m.milestoneUnlocks,
    });
  }),
);

export default router;
