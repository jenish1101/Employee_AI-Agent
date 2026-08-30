import { AuditLog } from "../models/auditLog.model.js";

export const createAuditLog = async ({
    companyId,
    userId,
    action,
    resourceType,
    resourceId,
    metadata = {}
}) => {
    return AuditLog.create({
        companyId,
        userId,
        action,
        resourceType,

        resourceId:
            resourceId?.toString(),

        metadata
    });
};