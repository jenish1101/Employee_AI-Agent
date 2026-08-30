import bcrypt from "bcryptjs";

import { Company } from "../models/company.model.js";
import { Employee } from "../models/employee.model.js";
import { User } from "../models/user.model.js";

import { generateToken } from "../utils/jwt.js";

export const registerUser = async ({
    companyName,
    companySlug,
    name,
    email,
    password,
    role = "admin"
}) => {
    const existingCompany =
        await Company.findOne({
            slug: companySlug
        });

    if (existingCompany) {
        throw new Error(
            "Company already exists"
        );
    }

    const company =
        await Company.create({
            name: companyName,
            slug: companySlug
        });

    const passwordHash =
        await bcrypt.hash(password, 12);

    const employee =
        await Employee.create({
            companyId: company._id,
            employeeCode: `EMP-${Date.now()}`,
            name,
            email
        });

    const user =
        await User.create({
            companyId: company._id,
            employeeId: employee._id,
            email,
            passwordHash,
            role
        });

    const token = generateToken({
        userId: user._id.toString(),
        companyId: company._id.toString(),
        employeeId: employee._id.toString(),
        role: user.role
    });

    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            employeeId: user.employeeId
        }
    };
};

export const loginUser = async ({
    email,
    password
}) => {
    const user =
        await User.findOne({
            email: email.toLowerCase()
        });

    if (!user) {
        throw new Error(
            "Invalid email or password"
        );
    }

    if (user.status !== "active") {
        throw new Error(
            "User account is disabled"
        );
    }

    const passwordValid =
        await bcrypt.compare(
            password,
            user.passwordHash
        );

    if (!passwordValid) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const token = generateToken({
        userId: user._id.toString(),
        companyId: user.companyId.toString(),
        employeeId: user.employeeId.toString(),
        role: user.role
    });

    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            employeeId: user.employeeId
        }
    };
};