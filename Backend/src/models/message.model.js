import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true
        },

        role: {
            type: String,
            enum: [
                "user",
                "assistant",
                "tool",
                "system"
            ],
            required: true
        },

        content: {
            type: String,
            required: true
        },

        toolCalls: {
            type: mongoose.Schema.Types.Mixed,
            default: []
        },

        sources: {
            type: mongoose.Schema.Types.Mixed,
            default: []
        }
    },
    {
        timestamps: true
    }
);

export const Message =
    mongoose.model("Message", messageSchema);