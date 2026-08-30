import rateLimit from "express-rate-limit";

export const apiRateLimit =
    rateLimit({
        windowMs:
            15 *
            60 *
            1000,

        limit: 200,

        standardHeaders:
            true,

        legacyHeaders:
            false,

        message: {
            success:
                false,

            message:
                "Too many requests. Please try again later."
        }
    });

export const aiRateLimit =
    rateLimit({
        windowMs:
            60 *
            1000,

        limit: 30,

        standardHeaders:
            true,

        legacyHeaders:
            false
    });

