import {
    tool
} from "@langchain/core/tools";

import { z } from "zod";

import {
    getEmployeeProfile,
    searchEmployees
} from "../services/employee.service.js";

export const createEmployeeTools =
    (context) => {
        const getProfile =
            tool(
                async () => {
                    return getEmployeeProfile({
                        employeeId:
                            context.employeeId,

                        companyId:
                            context.companyId
                    });
                },
                {
                    name:
                        "get_my_employee_profile",

                    description:
                        "Get the authenticated employee's profile.",

                    schema: z.object({})
                }
            );

        const search =
            tool(
                async ({
                    search: searchText
                }) => {
                    if (
                        ![
                            "hr",
                            "manager",
                            "admin"
                        ].includes(context.role)
                    ) {
                        throw new Error(
                            "You are not authorized to search employees."
                        );
                    }

                    return searchEmployees({
                        companyId:
                            context.companyId,

                        search: searchText
                    });
                },
                {
                    name:
                        "search_company_employees",

                    description:
                        "Search active employees within the authenticated company. Only HR, managers and admins may use this tool.",

                    schema: z.object({
                        search: z
                            .string()
                            .optional()
                            .describe(
                                "Employee name, email or designation"
                            )
                    })
                }
            );

        return [
            getProfile,
            search
        ];
    };