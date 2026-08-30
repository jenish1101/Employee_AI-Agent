import multer from "multer";

const storage =
    multer.memoryStorage();

const fileFilter = (
    req,
    file,
    callback
) => {
    if (
        file.mimetype !==
        "application/pdf"
    ) {
        return callback(
            new Error(
                "Only PDF files are currently supported"
            )
        );
    }

    callback(null, true);
};

export const uploadPolicyPdf =
    multer({
        storage,

        limits: {
            fileSize:
                10 * 1024 * 1024
        },

        fileFilter
    });