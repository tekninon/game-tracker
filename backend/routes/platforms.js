import express from "express";
import {
  getPlatforms,
  addPlatform,
} from "../controllers/platformController.js";

const router = express.Router();

router.get("/", getPlatforms);
router.post("/", addPlatform);

export default router;
