import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
            index: true
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true
        },

        year: {
            type: Number,
            required: true
        },

        casual: {
            type: Number,
            default: 0
        },

        sick: {
            type: Number,
            default: 0
        },

        paid: {
            type: Number,
            default: 0
        },

        unpaid: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

leaveBalanceSchema.index(
    {
        companyId: 1,
        employeeId: 1,
        year: 1
    },
    {
        unique: true
    }
);

export const LeaveBalance =
    mongoose.model(
        "LeaveBalance",
        leaveBalanceSchema
    );