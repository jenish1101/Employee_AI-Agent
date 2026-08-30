import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const generateToken = (payload) => {
    return jwt.sign(
        payload,
        env.jwtSecret,
        {
            expiresIn: env.jwtExpiresIn
        }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(
        token,
        env.jwtSecret
    );
};