import {
    RecursiveCharacterTextSplitter
} from "@langchain/textsplitters";

export const policyTextSplitter =
    new RecursiveCharacterTextSplitter({
        chunkSize: 1000,

        chunkOverlap: 200,

        separators: [
            "\n\n",
            "\n",
            ". ",
            " ",
            ""
        ]
    });

export const splitPolicyDocuments =
    async (documents) => {
        return policyTextSplitter
            .splitDocuments(documents);
    };