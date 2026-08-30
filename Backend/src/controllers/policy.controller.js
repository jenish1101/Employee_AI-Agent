import {
    ingestPolicyPdf
} from "../rag/ingestion/policy.ingestion.js";

import {
    Policy
} from "../models/policy.model.js";

import {
    archivePolicy as archivePolicyService
} from "../services/policy.service.js";

import {
    createAuditLog
} from "../services/audit.service.js";

export const uploadPolicy =
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message:
                    "PDF file is required"
            });
        }

        const {
            title,
            type,
            version = 1
        } = req.body;

        const policy =
            await ingestPolicyPdf({
                file:
                    req.file,

                title,

                type,

                version:
                    Number(version),

                companyId:
                    req.user.companyId,

                userId:
                    req.user.userId
            });

        await createAuditLog({
            companyId:
                req.user.companyId,

            userId:
                req.user.userId,

            action:
                "POLICY_UPLOADED",

            resourceType:
                "Policy",

            resourceId:
                policy._id,

            metadata: {
                title:
                    policy.title,

                type:
                    policy.type,

                version:
                    policy.version,

                chunkCount:
                    policy.chunkCount
            }
        });

        res.status(201).json({
            success: true,

            message:
                "Policy indexed successfully",

            data:
                policy
        });
    };

export const getPolicies =
    async (req, res) => {
        const policies =
            await Policy.find({
                companyId:
                    req.user.companyId
            })
                .sort({
                    createdAt: -1
                })
                .lean();

        res.json({
            success: true,
            data:
                policies
        });
    };

export const archivePolicy =
    async (req, res) => {
        const { id } = req.params;

        const policy =
            await archivePolicyService({
                policyId: id,
                companyId:
                    req.user.companyId
            });

        await createAuditLog({
            companyId:
                req.user.companyId,

            userId:
                req.user.userId,

            action:
                "POLICY_ARCHIVED",

            resourceType:
                "Policy",

            resourceId:
                policy._id,

            metadata: {
                title:
                    policy.title,

                version:
                    policy.version
            }
        });

        res.json({
            success: true,
            message:
                "Policy archived successfully",
            data: policy
        });
    };