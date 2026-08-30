import {
    GoogleGenerativeAIEmbeddings
} from "@langchain/google-genai";

import { env } from "../../config/env.js";

const baseEmbeddings =
    new GoogleGenerativeAIEmbeddings({
        apiKey: env.geminiApiKey,
        model: env.embeddingModel
    });

export const embeddings = {
    embedDocuments: async (texts) => {
        const vectors =
            await baseEmbeddings.embedDocuments(
                texts
            );
        return vectors.map((v) =>
            v.slice(0, 1024)
        );
    },

    embedQuery: async (text) => {
        const vector =
            await baseEmbeddings.embedQuery(
                text
            );
        return vector.slice(0, 1024);
    }
};