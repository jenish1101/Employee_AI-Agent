import {
    PineconeStore
} from "@langchain/pinecone";

import {
    embeddings
} from "../embeddings/gemini.embeddings.js";

import {
    pineconeIndex
} from "../../config/pinecone.js";

export const getPolicyVectorStore =
    async (companyId) => {
        return PineconeStore.fromExistingIndex(
            embeddings,
            {
                pineconeIndex,

                /*
                 * Critical multi-tenant isolation.
                 *
                 * Company A:
                 * company-abc
                 *
                 * Company B:
                 * company-xyz
                 */
                namespace:
                    `company-${companyId}`,

                maxConcurrency: 5
            }
        );
    };