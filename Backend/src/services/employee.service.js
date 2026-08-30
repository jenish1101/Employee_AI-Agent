import { Employee } from "../models/employee.model.js";

export const getEmployeeProfile =
    async ({
        employeeId,
        companyId
    }) => {
        const employee =
            await Employee.findOne({
                _id: employeeId,
                companyId
            })
                .populate("departmentId", "name")
                .populate(
                    "managerId",
                    "name email designation"
                )
                .lean();

        if (!employee) {
            throw new Error(
                "Employee not found"
            );
        }

        return employee;
    };

export const searchEmployees =
    async ({
        companyId,
        search
    }) => {
        const filter = {
            companyId,
            status: "active"
        };

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    designation: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        return Employee.find(filter)
            .select(
                "name email designation location joiningDate"
            )
            .limit(50)
            .lean();
    };