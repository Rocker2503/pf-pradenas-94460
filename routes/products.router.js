import Router from "express";
import { getPaginatedList } from "../controllers/product.controller.js";

const router = Router();

// GET /api/products/
router.get('/', getPaginatedList);

export default router;