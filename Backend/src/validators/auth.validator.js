import { z } from "zod";

export const registerSchema =
    z.object({
        companyName: z.string().min(2),

        companySlug: z
            .string()
            .min(2)
            .regex(
                /^[a-z0-9-]+$/,
                "Invalid company slug"
            ),

        name: z.string().min(2),

        email: z.string().email(),

        password: z.string().min(8)
    });

export const loginSchema =
    z.object({
        email: z.string().email(),

        password: z.string().min(1)
    });