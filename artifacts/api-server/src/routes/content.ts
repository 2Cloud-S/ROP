import { Router, type IRouter } from "express";
import { asyncHandler, sendData, AppError } from "../lib/envelope";
import { ContentAPI } from "../lib/content";

const router: IRouter = Router();

router.get(
  "/species",
  asyncHandler(async (_req, res) => {
    sendData(res, await ContentAPI.species());
  }),
);

router.get(
  "/species/:slug",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    const species = await ContentAPI.speciesBySlug(slug);
    if (!species) throw new AppError(404, "NOT_FOUND", "Species not found.");
    sendData(res, species);
  }),
);

router.get(
  "/evolutions",
  asyncHandler(async (_req, res) => {
    sendData(res, await ContentAPI.evolutions());
  }),
);

router.get(
  "/tasks",
  asyncHandler(async (_req, res) => {
    sendData(res, await ContentAPI.tasks());
  }),
);

router.get(
  "/rarities",
  asyncHandler(async (_req, res) => {
    sendData(res, await ContentAPI.rarities());
  }),
);

router.get(
  "/codex",
  asyncHandler(async (_req, res) => {
    sendData(res, await ContentAPI.codex());
  }),
);

router.get(
  "/codex/:slug",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    const entry = await ContentAPI.codexBySlug(slug);
    if (!entry) throw new AppError(404, "NOT_FOUND", "Codex entry not found.");
    sendData(res, entry);
  }),
);

export default router;
