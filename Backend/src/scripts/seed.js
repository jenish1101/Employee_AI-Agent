import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { Company } from "../models/company.model.js";
import { Department } from "../models/department.model.js";
import { Employee } from "../models/employee.model.js";
import { User } from "../models/user.model.js";
import { LeaveBalance } from "../models/leaveBalance.model.js";
import { Attendance } from "../models/attendance.model.js";
import { Policy } from "../models/policy.model.js";

async function seedData() {
    try {
        console.log("Connecting to MongoDB:", env.mongodbUri);
        await mongoose.connect(env.mongodbUri);

        console.log("Cleaning existing seed data for demo company...");
        const existingCompany = await Company.findOne({ slug: "acme-corp" });
        if (existingCompany) {
            const companyId = existingCompany._id;
            await User.deleteMany({ companyId });
            await Employee.deleteMany({ companyId });
            await Department.deleteMany({ companyId });
            await LeaveBalance.deleteMany({ companyId });
            await Attendance.deleteMany({ companyId });
            await Policy.deleteMany({ companyId });
            await Company.deleteOne({ _id: companyId });
        }

        console.log("Creating Demo Company...");
        const company = await Company.create({
            name: "Acme Corp",
            slug: "acme-corp",
            status: "active"
        });

        console.log("Creating Departments...");
        const engDept = await Department.create({
            companyId: company._id,
            name: "Engineering"
        });

        const hrDept = await Department.create({
            companyId: company._id,
            name: "Human Resources"
        });

        console.log("Creating Employees...");
        const passwordHash = await bcrypt.hash("Password123!", 10);

        // 1. Manager / HR Lead
        const managerEmp = await Employee.create({
            companyId: company._id,
            employeeCode: "EMP001",
            name: "Sarah Connor",
            email: "sarah.hr@acme.com",
            phone: "+1-555-0101",
            departmentId: hrDept._id,
            designation: "HR Manager",
            joiningDate: new Date("2022-01-15"),
            location: "New York",
            status: "active"
        });

        // 2. Software Engineer Employee
        const engineerEmp = await Employee.create({
            companyId: company._id,
            employeeCode: "EMP002",
            name: "John Doe",
            email: "john.engineer@acme.com",
            phone: "+1-555-0102",
            departmentId: engDept._id,
            designation: "Senior Software Engineer",
            managerId: managerEmp._id,
            joiningDate: new Date("2023-03-01"),
            location: "San Francisco",
            status: "active"
        });

        console.log("Creating User Accounts...");
        const hrUser = await User.create({
            companyId: company._id,
            employeeId: managerEmp._id,
            email: "sarah.hr@acme.com",
            passwordHash,
            role: "hr",
            status: "active"
        });

        const empUser = await User.create({
            companyId: company._id,
            employeeId: engineerEmp._id,
            email: "john.engineer@acme.com",
            passwordHash,
            role: "employee",
            status: "active"
        });

        console.log("Creating Leave Balances (2026)...");
        await LeaveBalance.create([
            {
                companyId: company._id,
                employeeId: managerEmp._id,
                year: 2026,
                casual: 12,
                sick: 10,
                paid: 15,
                unpaid: 0
            },
            {
                companyId: company._id,
                employeeId: engineerEmp._id,
                year: 2026,
                casual: 12,
                sick: 10,
                paid: 15,
                unpaid: 0
            }
        ]);

        console.log("Creating Attendance Records...");
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        await Attendance.create([
            {
                companyId: company._id,
                employeeId: engineerEmp._id,
                date: yesterday,
                checkIn: new Date(yesterday.setHours(9, 0, 0)),
                checkOut: new Date(yesterday.setHours(17, 30, 0)),
                status: "present"
            },
            {
                companyId: company._id,
                employeeId: managerEmp._id,
                date: yesterday,
                checkIn: new Date(yesterday.setHours(9, 15, 0)),
                checkOut: new Date(yesterday.setHours(18, 0, 0)),
                status: "present"
            }
        ]);

        console.log("Creating Sample Policy Entry...");
        const samplePolicy = await Policy.create({
            companyId: company._id,
            title: "Standard Remote Work Policy 2026",
            type: "leave",
            version: 1,
            status: "active",
            originalFilename: "remote_work_policy.pdf",
            mimeType: "application/pdf",
            chunkCount: 5,
            indexedAt: new Date(),
            createdBy: hrUser._id
        });

        console.log("✅ Data Injection Successfully Completed!");
        console.log("-----------------------------------------");
        console.log("Seed Credentials:");
        console.log("HR User:       sarah.hr@acme.com / Password123!");
        console.log("Employee User: john.engineer@acme.com / Password123!");
        console.log("Company ID:   ", company._id.toString());
        console.log("Sample Policy ID: ", samplePolicy._id.toString());
        console.log("-----------------------------------------");

        process.exit(0);
    } catch (error) {
        console.error("❌ Data Injection Failed:", error);
        process.exit(1);
    }
}

seedData();
