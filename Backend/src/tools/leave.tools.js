import {
    tool
} from "@langchain/core/tools";

import { z } from "zod";

import {
    getLeaveBalance,
    getLeaveRequests,
    applyLeave
} from "../services/leave.service.js";

import {
    createAuditLog
} from "../services/audit.service.js";

export const createLeaveTools =
    (context) => {
        const balance =
            tool(
                async ({
                    year
                }) => {
                    return getLeaveBalance({
                        employeeId:
                            context.employeeId,

                        companyId:
                            context.companyId,

                        year:
                            year ||
                            new Date()
                                .getFullYear()
                    });
                },
                {
                    name:
                        "get_my_leave_balance",

                    description:
                        "Get the authenticated employee's leave balance.",

                    schema:
                        z.object({
                            year:
                                z
                                    .number()
                                    .optional()
                        })
                }
            );

        const requests =
            tool(
                async () => {
                    return getLeaveRequests({
                        employeeId:
                            context.employeeId,

                        companyId:
                            context.companyId
                    });
                },
                {
                    name:
                        "get_my_leave_requests",

                    description:
                        "Get the authenticated employee's leave requests.",

                    schema:
                        z.object({})
                }
            );

        const apply = tool(
            async ({
                leaveType,
                startDate,
                endDate,
                reason
            }) => {
                if (!context.allowActions) {
                    throw new Error(
                        "This action requires explicit confirmation."
                    );
                }

                const request =
                    await applyLeave({
                        employeeId:
                            context.employeeId,

                        companyId:
                            context.companyId,

                        leaveType,
                        startDate,
                        endDate,
                        reason
                    });

                // AUDIT LOG
                await createAuditLog({
                    companyId:
                        context.companyId,

                    userId:
                        context.userId,

                    action:
                        "LEAVE_REQUEST_CREATED",

                    resourceType:
                        "LeaveRequest",

                    resourceId:
                        request._id,

                    metadata: {
                        leaveType:
                            request.leaveType,

                        startDate:
                            request.startDate,

                        endDate:
                            request.endDate,

                        days:
                            request.days
                    }
                });

                return {
                    success: true,

                    message:
                        "Leave request submitted successfully.",

                    leaveRequestId:
                        request._id,

                    status:
                        request.status,

                    days:
                        request.days
                };
            },
            {
                name: "apply_leave",

                description:
                    "Submit a leave request for the authenticated employee.",

                schema: z.object({
                    leaveType:
                        z.enum([
                            "casual",
                            "sick",
                            "paid",
                            "unpaid"
                        ]),

                    startDate:
                        z.string(),

                    endDate:
                        z.string(),

                    reason:
                        z.string().min(2)
                })
            }
        );

        return [
            balance,
            requests,
            apply
        ];
    };