import {
    getPolicyVectorStore
} from "../vectorstore/pinecone.store.js";

export const searchCompanyPolicies =
    async ({
        companyId,
        query,
        policyType,
        limit = 5
    }) => {
        const vectorStore =
            await getPolicyVectorStore(
                companyId
            );

        const filter = {
            status:
                "active"
        };

        if (policyType) {
            filter.policyType =
                policyType;
        }

        const documents =
            await vectorStore
                .similaritySearch(
                    query,
                    limit,
                    filter
                );

        return documents.map(
            (document) => ({
                content:
                    document.pageContent,

                policyId:
                    document.metadata
                        .policyId,

                title:
                    document.metadata
                        .title,

                policyType:
                    document.metadata
                        .policyType,

                version:
                    document.metadata
                        .version,

                pageNumber:
                    document.metadata
                        .pageNumber,

                chunkIndex:
                    document.metadata
                        .chunkIndex
            })
        );
    };