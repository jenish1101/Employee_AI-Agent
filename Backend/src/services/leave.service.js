import {
    LeaveBalance
} from "../models/leaveBalance.model.js";

import {
    LeaveRequest
} from "../models/leaveRequest.model.js";

import {
    calculateLeaveDays
} from "../utils/date.js";

import {
    Employee
} from "../models/employee.model.js";


export const getLeaveBalance =
    async ({
        employeeId,
        companyId,
        year
    }) => {
        const balance =
            await LeaveBalance.findOne({
                employeeId,
                companyId,
                year
            }).lean();

        if (!balance) {
            throw new Error(
                "Leave balance not found"
            );
        }

        return balance;
    };

export const getLeaveRequests =
    async ({
        employeeId,
        companyId
    }) => {
        return LeaveRequest.find({
            employeeId,
            companyId
        })
            .sort({
                createdAt: -1
            })
            .limit(50)
            .lean();
    };

export const applyLeave =
    async ({
        employeeId,
        companyId,
        leaveType,
        startDate,
        endDate,
        reason
    }) => {
        const days =
            calculateLeaveDays(
                startDate,
                endDate
            );

        const supportedTypes = [
            "casual",
            "sick",
            "paid",
            "unpaid"
        ];

        if (
            !supportedTypes.includes(
                leaveType
            )
        ) {
            throw new Error(
                "Unsupported leave type"
            );
        }

        /*
         * Check overlapping requests.
         */
        const conflict =
            await LeaveRequest.findOne({
                employeeId,

                companyId,

                status: {
                    $in: [
                        "pending",
                        "approved"
                    ]
                },

                startDate: {
                    $lte:
                        new Date(
                            endDate
                        )
                },

                endDate: {
                    $gte:
                        new Date(
                            startDate
                        )
                }
            });

        if (conflict) {
            throw new Error(
                "You already have a leave request overlapping these dates."
            );
        }

        /*
         * Unpaid leave doesn't require
         * available paid balance.
         */
        if (
            leaveType !==
            "unpaid"
        ) {
            const year =
                new Date(
                    startDate
                ).getFullYear();

            const balance =
                await LeaveBalance.findOne({
                    employeeId,
                    companyId,
                    year
                });

            if (!balance) {
                throw new Error(
                    "Leave balance not found"
                );
            }

            const available =
                balance[
                leaveType
                ];

            if (
                available <
                days
            ) {
                throw new Error(
                    `Insufficient ${leaveType} leave balance. Available: ${available}, requested: ${days}.`
                );
            }
        }

        const request =
            await LeaveRequest.create({
                employeeId,

                companyId,

                leaveType,

                startDate:
                    new Date(
                        startDate
                    ),

                endDate:
                    new Date(
                        endDate
                    ),

                days,

                reason,

                status:
                    "pending"
            });

        return request;
    };

export const approveLeaveRequest =
    async ({
        requestId,
        companyId,
        approverUserId,
        approverEmployeeId,
        role
    }) => {
        const request =
            await LeaveRequest.findOne({
                _id:
                    requestId,

                companyId
            });

        if (!request) {
            throw new Error(
                "Leave request not found"
            );
        }

        if (
            request.status !==
            "pending"
        ) {
            throw new Error(
                "Only pending leave requests can be approved"
            );
        }

        const employee =
            await Employee.findOne({
                _id:
                    request.employeeId,

                companyId
            });

        if (!employee) {
            throw new Error(
                "Employee not found"
            );
        }

        const privileged =
            [
                "hr",
                "admin"
            ].includes(role);

        const directManager =
            role ===
            "manager" &&
            employee.managerId?.toString() ===
            approverEmployeeId.toString();

        if (
            !privileged &&
            !directManager
        ) {
            throw new Error(
                "You are not authorized to approve this leave request."
            );
        }

        if (
            request.leaveType !==
            "unpaid"
        ) {
            const year =
                new Date(
                    request.startDate
                ).getFullYear();

            const field =
                request.leaveType;

            const balance =
                await LeaveBalance.findOne({
                    employeeId:
                        request.employeeId,

                    companyId,

                    year
                });

            if (!balance) {
                throw new Error(
                    "Employee leave balance not found"
                );
            }

            if (
                balance[field] <
                request.days
            ) {
                throw new Error(
                    "Employee no longer has sufficient leave balance."
                );
            }

            balance[field] -=
                request.days;

            await balance.save();
        }

        request.status =
            "approved";

        request.approvedBy =
            approverUserId;

        await request.save();

        return request;
    };

export const rejectLeaveRequest =
    async ({
        requestId,
        companyId,
        approverUserId,
        approverEmployeeId,
        role,
        reason
    }) => {
        const request =
            await LeaveRequest.findOne({
                _id:
                    requestId,

                companyId
            });

        if (!request) {
            throw new Error(
                "Leave request not found"
            );
        }

        if (
            request.status !==
            "pending"
        ) {
            throw new Error(
                "Only pending requests can be rejected"
            );
        }

        const employee =
            await Employee.findOne({
                _id:
                    request.employeeId,

                companyId
            });

        const privileged =
            [
                "hr",
                "admin"
            ].includes(role);

        const directManager =
            role ===
            "manager" &&
            employee
                ?.managerId
                ?.toString() ===
            approverEmployeeId.toString();

        if (
            !privileged &&
            !directManager
        ) {
            throw new Error(
                "You are not authorized to reject this request."
            );
        }

        request.status =
            "rejected";

        request.rejectedBy =
            approverUserId;

        request.rejectionReason =
            reason;

        await request.save();

        return request;
    };