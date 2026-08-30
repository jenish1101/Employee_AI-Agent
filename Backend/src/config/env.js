import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
    "MONGODB_URI",
    "JWT_SECRET",
    "GEMINI_API_KEY",
    "PINECONE_API_KEY",
    "PINECONE_INDEX_NAME"
];

for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(
            `Missing environment variable: ${variable}`
        );
    }
}

export const env = {
    port: Number(process.env.PORT || 5000),

    nodeEnv:
        process.env.NODE_ENV || "development",

    mongodbUri:
        process.env.MONGODB_URI,

    jwtSecret:
        process.env.JWT_SECRET,

    jwtExpiresIn:
        process.env.JWT_EXPIRES_IN || "7d",

    geminiApiKey:
        process.env.GEMINI_API_KEY,

    geminiModel:
        process.env.GEMINI_MODEL ||
        "gemini-3.6-flash",

    embeddingModel:
        process.env.GEMINI_EMBEDDING_MODEL ||
        "gemini-embedding-001",

    pineconeApiKey:
        process.env.PINECONE_API_KEY,

    pineconeIndexName:
        process.env.PINECONE_INDEX_NAME,

    frontendUrl:
        process.env.FRONTEND_URL ||
        "http://localhost:5173"
};