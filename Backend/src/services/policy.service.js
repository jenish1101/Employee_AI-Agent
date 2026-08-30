import { Policy } from "../models/policy.model.js";

export const archivePolicy = async ({ policyId, companyId }) => {
    const policy = await Policy.findOneAndUpdate(
        {
            _id: policyId,
            companyId
        },
        {
            status: "archived"
        },
        {
            new: true
        }
    );

    if (!policy) {
        throw new Error("Policy not found");
    }

    return policy;
};
