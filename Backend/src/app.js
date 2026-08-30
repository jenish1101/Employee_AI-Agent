import express from "express";
const app = express();
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import policyRoutes from "./routes/policy.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";
import { apiRateLimit } from "./middleware/rateLimit.middleware.js";


app.use(
    cors({
        origin: env.frontendUrl,
        credentials: true
    })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(
    express.json({
        limit: "2mb"
    })
);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.get(
    "/health",
    (req, res) => {
        res.json({
            success: true,

            service:
                "ai-hr-agent",

            timestamp:
                new Date()
                    .toISOString()
        });
    }
);


app.use("/api", apiRateLimit);

app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/policies", policyRoutes);

app.use(errorHandler);

export default app;
