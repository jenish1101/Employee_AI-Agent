import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true
        },

        employeeCode: {
            type: String,
            required: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            trim: true
        },

        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department"
        },

        designation: {
            type: String,
            trim: true
        },

        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null
        },

        joiningDate: Date,

        location: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "active",
                "inactive",
                "terminated"
            ],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

employeeSchema.index({
    companyId: 1,
    email: 1
});

employeeSchema.index({
    companyId: 1,
    employeeCode: 1
});

export const Employee =
    mongoose.model("Employee", employeeSchema);