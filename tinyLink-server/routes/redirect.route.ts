import { Router } from "express";
import { RedirectLinkController } from "../controllers/redirectLink.controller";
import { GetLinkController } from "../controllers/getLink.controller";

const router = Router();

//health route 
router.get("/healthz", GetLinkController.healthCheck);

//redirect route
router.get("/:slug", RedirectLinkController.redirectLink);

export default router;
