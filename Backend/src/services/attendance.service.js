import { Attendance } from "../models/attendance.model.js";

export const getAttendance =
    async ({
        employeeId,
        companyId,
        startDate,
        endDate
    }) => {
        const filter = {
            employeeId,
            companyId
        };

        if (startDate || endDate) {
            filter.date = {};

            if (startDate) {
                filter.date.$gte =
                    new Date(startDate);
            }

            if (endDate) {
                filter.date.$lte =
                    new Date(endDate);
            }
        }

        return Attendance.find(filter)
            .sort({
                date: -1
            })
            .limit(100)
            .lean();
    };