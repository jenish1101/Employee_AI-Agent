import express from "express";
import { aiRateLimit } from "../middleware/rateLimit.middleware.js";

import {
    authenticate
} from "../middleware/auth.middleware.js";

import {
    chat
} from "../controllers/chat.controller.js";

const router =
    express.Router();

router.post(
    "/",
    authenticate,
    aiRateLimit,
    chat
);

export default router;