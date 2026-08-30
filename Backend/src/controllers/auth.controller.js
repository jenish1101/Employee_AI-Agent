import {
    registerUser,
    loginUser
} from "../services/auth.service.js";

import {
    registerSchema,
    loginSchema
} from "../validators/auth.validator.js";

export const register = async (
    req,
    res
) => {
    const data =
        registerSchema.parse(req.body);

    const result =
        await registerUser(data);

    res.status(201).json({
        success: true,
        data: result
    });
};

export const login = async (
    req,
    res
) => {
    const data =
        loginSchema.parse(req.body);

    const result =
        await loginUser(data);

    res.status(200).json({
        success: true,
        data: result
    });
};

export const me = async (
    req,
    res
) => {
    res.json({
        success: true,
        user: req.user
    });
};