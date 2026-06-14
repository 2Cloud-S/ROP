import { Router, type IRouter } from "express";
import {
  GrowPlantBody,
  EvolvePlantBody,
  ActivatePlantBody,
} from "@workspace/game-core";
import { asyncHandler, sendData, AppError } from "../lib/envelope";
import { growPlant, evolvePlant } from "../services/plantService";

const router: IRouter = Router();

router.post(
  "/grow",
  asyncHandler(async (req, res) => {
    const body = GrowPlantBody.parse(req.body);
    const result = growPlant(body.player, body.plantId, body.action, body.demoMode);
    sendData(res, result);
  }),
);

router.post(
  "/evolve",
  asyncHandler(async (req, res) => {
    const body = EvolvePlantBody.parse(req.body);
    const result = await evolvePlant(body.player, body.plantId, body.demoMode);
    sendData(res, result);
  }),
);

router.post(
  "/activate",
  asyncHandler(async (req, res) => {
    const body = ActivatePlantBody.parse(req.body);
    const plant = body.player.plants.find((p) => p.id === body.plantId);
    if (!plant) throw new AppError(404, "PLANT_NOT_FOUND", "Plant not found.");
    sendData(res, { player: { ...body.player, activePlantId: body.plantId } });
  }),
);

export default router;
