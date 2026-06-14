import { Router, type IRouter } from "express";
import { StartBattleBody, BattleActionBody } from "@workspace/game-core";
import { asyncHandler, sendData } from "../lib/envelope";
import { startBattle, performBattleAction } from "../services/battleService";
import { applyMilestones } from "../lib/milestones";

const router: IRouter = Router();

router.post(
  "/start",
  asyncHandler(async (req, res) => {
    const body = StartBattleBody.parse(req.body);
    const battle = await startBattle(body.player);
    sendData(res, { battle });
  }),
);

router.post(
  "/action",
  asyncHandler(async (req, res) => {
    const body = BattleActionBody.parse(req.body);
    const result = await performBattleAction(
      body.player,
      body.battle,
      body.action,
      body.demoMode,
    );
    const m = await applyMilestones(result.player, body.demoMode);
    sendData(res, {
      ...result,
      player: m.player,
      milestoneUnlocks: m.milestoneUnlocks,
    });
  }),
);

export default router;
