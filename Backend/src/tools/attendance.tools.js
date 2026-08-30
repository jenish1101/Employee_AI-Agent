import {
    tool
} from "@langchain/core/tools";

import { z } from "zod";

import {
    getAttendance
} from "../services/attendance.service.js";

export const createAttendanceTools =
    (context) => {
        const attendance =
            tool(
                async ({
                    startDate,
                    endDate
                }) => {
                    return getAttendance({
                        employeeId:
                            context.employeeId,

                        companyId:
                            context.companyId,

                        startDate,
                        endDate
                    });
                },
                {
                    name:
                        "get_my_attendance",

                    description:
                        "Get the authenticated employee's attendance records.",

                    schema: z.object({
                        startDate: z
                            .string()
                            .optional(),

                        endDate: z
                            .string()
                            .optional()
                    })
                }
            );

        return [attendance];
    };