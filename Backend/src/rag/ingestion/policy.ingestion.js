import {
    loadPdf
} from "./pdf.loader.js";

import {
    splitPolicyDocuments
} from "./document.splitter.js";

import {
    getPolicyVectorStore
} from "../vectorstore/pinecone.store.js";

import {
    Policy
} from "../../models/policy.model.js";

export const ingestPolicyPdf =
    async ({
        file,
        title,
        type,
        version,
        companyId,
        userId
    }) => {
        const policy =
            await Policy.create({
                companyId,

                title,

                type,

                version,

                status:
                    "processing",

                originalFilename:
                    file.originalname,

                mimeType:
                    file.mimetype,

                createdBy:
                    userId
            });

        try {
            /*
             * STEP 1
             * PDF → LangChain Documents
             */
            const pages =
                await loadPdf(
                    file.buffer
                );

            if (!pages.length) {
                throw new Error(
                    "No readable text found in PDF"
                );
            }

            /*
             * STEP 2
             * Pages → smaller chunks
             */
            const chunks =
                await splitPolicyDocuments(
                    pages
                );

            /*
             * STEP 3
             * Add metadata
             */
            const enrichedChunks =
                chunks.map(
                    (
                        document,
                        index
                    ) => ({
                        ...document,

                        metadata: {
                            companyId:
                                companyId.toString(),

                            policyId:
                                policy._id.toString(),

                            title,

                            policyType:
                                type,

                            version,

                            status:
                                "active",

                            chunkIndex:
                                index,

                            pageNumber:
                                document
                                    .metadata
                                    ?.loc
                                    ?.pageNumber || null
                        }
                    })
                );

            /*
             * STEP 4
             * Deterministic IDs
             */
            const ids =
                enrichedChunks.map(
                    (_, index) =>
                        `${policy._id.toString()}-chunk-${index}`
                );

            /*
             * STEP 5
             * LangChain → embeddings →
             * Pinecone
             */
            const vectorStore =
                await getPolicyVectorStore(
                    companyId
                );

            await vectorStore.addDocuments(
                enrichedChunks,
                {
                    ids
                }
            );

            /*
             * STEP 6
             * Update policy metadata
             */
            policy.status =
                "active";

            policy.chunkCount =
                enrichedChunks.length;

            policy.indexedAt =
                new Date();

            await policy.save();

            return policy;
        } catch (error) {
            policy.status =
                "failed";

            await policy.save();

            throw error;
        }
    };