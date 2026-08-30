import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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

        date: {
            type: Date,
            required: true
        },

        checkIn: Date,

        checkOut: Date,

        status: {
            type: String,
            enum: [
                "present",
                "absent",
                "half-day",
                "leave",
                "holiday"
            ],
            required: true
        }
    },
    {
        timestamps: true
    }
);

attendanceSchema.index(
    {
        companyId: 1,
        employeeId: 1,
        date: 1
    },
    {
        unique: true
    }
);

export const Attendance =
    mongoose.model(
        "Attendance",
        attendanceSchema
    );