import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true
        },

        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: [
                "employee",
                "manager",
                "hr",
                "admin"
            ],
            default: "employee"
        },

        status: {
            type: String,
            enum: ["active", "disabled"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

userSchema.index({
    companyId: 1,
    email: 1
});

export const User =
    mongoose.model("User", userSchema);