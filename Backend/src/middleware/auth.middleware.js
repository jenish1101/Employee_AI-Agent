import { verifyToken } from "../utils/jwt.js";

export const authenticate = (
    req,
    res,
    next
) => {
    try {
        const header =
            req.headers.authorization;

        if (!header?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token =
            header.split(" ")[1];

        const decoded =
            verifyToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};