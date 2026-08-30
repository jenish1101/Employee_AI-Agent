import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
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

        period: {
            type: String,
            required: true
        },

        gross: {
            type: Number,
            required: true
        },

        deductions: {
            type: Number,
            default: 0
        },

        net: {
            type: Number,
            required: true
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

export const Payroll =
    mongoose.model("Payroll", payrollSchema);