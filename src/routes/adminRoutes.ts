import { Router } from "express";
import {
  addQuestion,
  updateConfiguration,
} from "../controllers/adminController";

const router = Router();

router.post("/admin/question", addQuestion);
router.put("/admin/configuration", updateConfiguration);

export default router;
