import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
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

        leaveType: {
            type: String,
            enum: [
                "casual",
                "sick",
                "paid",
                "unpaid"
            ],
            required: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        days: {
            type: Number,
            required: true
        },

        reason: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
                "cancelled"
            ],
            default: "pending"
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        rejectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        rejectionReason: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

leaveRequestSchema.index({
    companyId: 1,
    employeeId: 1,
    startDate: 1
});

export const LeaveRequest =
    mongoose.model(
        "LeaveRequest",
        leaveRequestSchema
    );