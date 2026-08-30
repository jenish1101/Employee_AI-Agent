import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null
        }
    },
    {
        timestamps: true
    }
);

departmentSchema.index({
    companyId: 1,
    name: 1
});

export const Department =
    mongoose.model("Department", departmentSchema);