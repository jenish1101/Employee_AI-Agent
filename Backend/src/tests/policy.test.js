import { describe, it, expect, vi, beforeEach } from "vitest";
import { archivePolicy } from "../services/policy.service.js";
import { Policy } from "../models/policy.model.js";

vi.mock("../models/policy.model.js", () => ({
    Policy: {
        findOneAndUpdate: vi.fn()
    }
}));

describe("Policy Service - archivePolicy", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should update policy status to archived and return updated policy", async () => {
        const fakePolicy = {
            _id: "policy123",
            title: "Remote Work Policy",
            version: 1,
            status: "archived"
        };

        Policy.findOneAndUpdate.mockResolvedValue(fakePolicy);

        const result = await archivePolicy({
            policyId: "policy123",
            companyId: "company123"
        });

        expect(Policy.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: "policy123", companyId: "company123" },
            { status: "archived" },
            { new: true }
        );
        expect(result).toEqual(fakePolicy);
    });

    it("should throw error if policy is not found", async () => {
        Policy.findOneAndUpdate.mockResolvedValue(null);

        await expect(
            archivePolicy({
                policyId: "invalid_id",
                companyId: "company123"
            })
        ).rejects.toThrow("Policy not found");
    });
});
