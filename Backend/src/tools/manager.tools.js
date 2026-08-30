import {
    tool
} from "@langchain/core/tools";

import { z } from "zod";

import {
    approveLeaveRequest,
    rejectLeaveRequest
} from "../services/leave.service.js";

import {
    createAuditLog
} from "../services/audit.service.js";

export const createManagerTools =
    (context) => {

        const approve = tool(
            async ({
                requestId
            }) => {
                if (!context.allowActions) {
                    throw new Error(
                        "Approval requires explicit confirmation."
                    );
                }

                const request =
                    await approveLeaveRequest({
                        requestId,

                        companyId:
                            context.companyId,

                        approverUserId:
                            context.userId,

                        approverEmployeeId:
                            context.employeeId,

                        role:
                            context.role
                    });

                await createAuditLog({
                    companyId:
                        context.companyId,

                    userId:
                        context.userId,

                    action:
                        "LEAVE_REQUEST_APPROVED",

                    resourceType:
                        "LeaveRequest",

                    resourceId:
                        request._id,

                    metadata: {
                        employeeId:
                            request.employeeId,

                        leaveType:
                            request.leaveType,

                        days:
                            request.days
                    }
                });

                return {
                    success: true,

                    message:
                        "Leave request approved.",

                    leaveRequestId:
                        request._id,

                    status:
                        request.status
                };
            },
            {
                name:
                    "approve_leave_request",

                description:
                    "Approve a pending employee leave request.",

                schema:
                    z.object({
                        requestId:
                            z.string()
                    })
            }
        );

        const reject = tool(
            async ({
                requestId,
                reason
            }) => {
                if (!context.allowActions) {
                    throw new Error(
                        "Rejection requires explicit confirmation."
                    );
                }

                const request =
                    await rejectLeaveRequest({
                        requestId,

                        companyId:
                            context.companyId,

                        approverUserId:
                            context.userId,

                        approverEmployeeId:
                            context.employeeId,

                        role:
                            context.role,

                        reason
                    });

                await createAuditLog({
                    companyId:
                        context.companyId,

                    userId:
                        context.userId,

                    action:
                        "LEAVE_REQUEST_REJECTED",

                    resourceType:
                        "LeaveRequest",

                    resourceId:
                        request._id,

                    metadata: {
                        employeeId:
                            request.employeeId,

                        leaveType:
                            request.leaveType,

                        days:
                            request.days,

                        reason
                    }
                });

                return {
                    success: true,

                    message:
                        "Leave request rejected.",

                    leaveRequestId:
                        request._id,

                    status:
                        request.status
                };
            },
            {
                name:
                    "reject_leave_request",

                description:
                    "Reject a pending employee leave request.",

                schema:
                    z.object({
                        requestId:
                            z.string(),

                        reason:
                            z
                                .string()
                                .min(2)
                    })
            }
        );

        return [
            approve,
            reject
        ];
    };