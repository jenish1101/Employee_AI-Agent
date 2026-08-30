import {
    ChatGoogleGenerativeAI
} from "@langchain/google-genai";

import { env } from "../config/env.js";

export const llm =
    new ChatGoogleGenerativeAI({
        apiKey: env.geminiApiKey,

        model: env.geminiModel,

        temperature: 0,

        maxRetries: 2
    });