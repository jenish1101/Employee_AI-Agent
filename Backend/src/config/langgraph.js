import {
    MongoClient
} from "mongodb";

import {
    MongoDBSaver
} from "@langchain/langgraph-checkpoint-mongodb";

import {
    env
} from "./env.js";

const langGraphMongoClient =
    new MongoClient(
        env.mongodbUri
    );

await langGraphMongoClient.connect();

export const checkpointer =
    new MongoDBSaver({
        client:
            langGraphMongoClient
    });