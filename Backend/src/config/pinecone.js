import {
    Pinecone
} from "@pinecone-database/pinecone";

import { env } from "./env.js";

export const pinecone =
    new Pinecone({
        apiKey: env.pineconeApiKey
    });

export const pineconeIndex =
    pinecone.Index(
        env.pineconeIndexName
    );