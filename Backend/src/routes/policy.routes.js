import express from "express";

import {
    authenticate
} from "../middleware/auth.middleware.js";

import {
    authorize
} from "../middleware/role.middleware.js";

import {
    uploadPolicyPdf
} from "../middleware/upload.middleware.js";

import {
    uploadPolicy,
    getPolicies,
    archivePolicy
} from "../controllers/policy.controller.js";

const router =
    express.Router();

router.get(
    "/",
    authenticate,
    getPolicies
);

router.post(
    "/upload",
    authenticate,

    authorize(
        "hr",
        "admin"
    ),

    uploadPolicyPdf.single(
        "file"
    ),

    uploadPolicy
);

router.patch(
    "/:id/archive",
    authenticate,

    authorize(
        "hr",
        "admin"
    ),

    archivePolicy
);

export default router;