import {
    tool
} from "@langchain/core/tools";

import { z } from "zod";

import {
    searchCompanyPolicies
} from "../rag/retrieval/policy.retriever.js";

export const createPolicyTools =
    (context) => {
        const searchPolicy =
            tool(
                async ({
                    query,
                    policyType
                }) => {
                    const documents =
                        await searchCompanyPolicies({
                            companyId:
                                context.companyId,

                            query,

                            policyType,

                            limit: 5
                        });

                    if (!documents.length) {
                        return {
                            found: false,

                            message:
                                "No relevant company policy was found."
                        };
                    }

                    return {
                        found: true,

                        results:
                            documents
                    };
                },
                {
                    name:
                        "search_company_policy",

                    description:
                        `Search official company policy documents.
                        Use this tool whenever the user asks about HR policies,
                        leave rules, attendance rules, work from home,
                        resignation, notice period, benefits, expenses,
                        code of conduct or similar company rules.`,

                    schema:
                        z.object({
                            query:
                                z
                                    .string()
                                    .min(2)
                                    .describe(
                                        "The policy question or search query"
                                    ),

                            policyType:
                                z
                                    .string()
                                    .optional()
                                    .describe(
                                        "Optional policy category such as leave, attendance, work-from-home or resignation"
                                    )
                        })
                }
            );

        return [
            searchPolicy
        ];
    };