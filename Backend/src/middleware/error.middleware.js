export const errorHandler = (
    error,
    req,
    res,
    next
) => {
    console.error(error);

    if (error.name === "ZodError") {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.issues
        });
    }

    return res.status(500).json({
        success: false,
        message:
            error.message ||
            "Internal server error"
    });
};