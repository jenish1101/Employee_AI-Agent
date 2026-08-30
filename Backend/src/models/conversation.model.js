import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true
        },

        title: {
            type: String,
            default: "New conversation"
        }
    },
    {
        timestamps: true
    }
);

export const Conversation =
    mongoose.model(
        "Conversation",
        conversationSchema
    );